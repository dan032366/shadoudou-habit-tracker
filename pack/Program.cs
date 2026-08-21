using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace ShadoudouHabit
{
    internal static class Program
    {
        [STAThread]
        private static void Main(string[] args)
        {
            bool createdNew;
            using (var mutex = new Mutex(true, "ShadoudouHabit_SingleInstance", out createdNew))
            {
                if (!createdNew)
                {
                    MessageBox.Show(
                        "傻豆豆的打卡日常已在运行。\n\n请先退出任务栏托盘中的旧实例（右键图标 → 退出），或从任务管理器结束“傻豆豆的打卡日常”进程后再打开。",
                        "傻豆豆的打卡日常",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information);
                    return;
                }

                int port = 0;
                bool noBrowser = false;
                string debugPort = "";
                for (int i = 0; i < args.Length; i++)
                {
                    if (args[i] == "--port" && i + 1 < args.Length)
                    {
                        int p;
                        if (int.TryParse(args[i + 1], out p)) port = p;
                        i++;
                    }
                    if (args[i] == "--no-browser") noBrowser = true;
                    if (args[i] == "--debug-port" && i + 1 < args.Length)
                    {
                        debugPort = args[i + 1];
                        i++;
                    }
                }
                if (port <= 0 || port > 65535) port = FindFreePort();

                var server = new TinyHttpServer(port);
                server.Start();

                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                using (var app = new AppHost("http://127.0.0.1:" + port + "/", server, debugPort))
                {
                    if (!noBrowser) app.OpenBrowser();
                    Application.Run(app.Form);
                }
            }
        }

        private static int FindFreePort()
        {
            var l = new TcpListener(IPAddress.Loopback, 0);
            l.Start();
            int port = ((IPEndPoint)l.LocalEndpoint).Port;
            l.Stop();
            return port;
        }
    }

    internal class Resource
    {
        public byte[] Bytes;
        public string ContentType;
    }

    internal class TinyHttpServer
    {
        private static readonly object StorageLock = new object();
        private readonly int _port;
        private TcpListener _listener;
        private volatile bool _running;
        private Thread _thread;

        public TinyHttpServer(int port)
        {
            _port = port;
        }

        public void Start()
        {
            _running = true;
            _listener = new TcpListener(IPAddress.Loopback, _port);
            _listener.Start();
            _thread = new Thread(Loop);
            _thread.IsBackground = true;
            _thread.Start();
        }

        public void Stop()
        {
            _running = false;
            try
            {
                if (_listener != null) _listener.Stop();
            }
            catch { }
        }

        private void Loop()
        {
            while (_running)
            {
                TcpClient client = null;
                try
                {
                    client = _listener.AcceptTcpClient();
                }
                catch
                {
                    break;
                }
                var c = client;
                ThreadPool.QueueUserWorkItem(delegate { Handle(c); });
            }
        }

        private void Handle(TcpClient client)
        {
            try
            {
                using (client)
                using (var stream = client.GetStream())
                {
                    byte[] all = ReadRequest(stream);
                    if (all == null || all.Length == 0) return;

                    int headerEnd = IndexOfHeaderEnd(all);
                    if (headerEnd < 0) return;
                    string headerText = Encoding.ASCII.GetString(all, 0, headerEnd);
                    int bodyStart = headerEnd + 4;
                    int contentLength = ParseContentLength(headerText);

                    byte[] body = new byte[Math.Max(0, contentLength)];
                    int have = all.Length - bodyStart;
                    if (have > 0) Array.Copy(all, bodyStart, body, 0, Math.Min(have, body.Length));
                    if (have < body.Length)
                    {
                        int off = Math.Max(0, have);
                        while (off < body.Length)
                        {
                            int r = stream.Read(body, off, body.Length - off);
                            if (r <= 0) break;
                            off += r;
                        }
                    }

                    string[] lines = headerText.Split('\r');
                    string requestLine = lines[0];
                    string[] parts = requestLine.Split(' ');
                    string method = parts.Length > 0 ? parts[0].Trim() : "GET";
                    string path = parts.Length > 1 ? parts[1].Trim() : "/";

                    if (path.StartsWith("/api/storage"))
                    {
                        if (method == "GET")
                        {
                            ServeBytes(stream, 200, "OK", "application/json; charset=utf-8", ReadStorage());
                        }
                        else if (method == "PUT" || method == "POST")
                        {
                            WriteStorage(body);
                            ServeBytes(stream, 200, "OK", "text/plain; charset=utf-8", Encoding.UTF8.GetBytes("ok"));
                        }
                        else
                        {
                            ServeBytes(stream, 404, "Not Found", "text/plain; charset=utf-8", Encoding.UTF8.GetBytes("404"));
                        }
                        return;
                    }

                    string name = (path == "/" || path.Length == 0) ? "index.html" : path.TrimStart('/');
                    Resource res = GetResource(name);
                    byte[] respBody = res != null ? res.Bytes : Encoding.UTF8.GetBytes("404 Not Found");
                    if (res != null && name == "index.html")
                    {
                        respBody = InjectExeMarker(res.Bytes);
                    }
                    string ct = res != null ? res.ContentType : "text/plain; charset=utf-8";
                    int status = res != null ? 200 : 404;
                    ServeBytes(stream, status, status == 200 ? "OK" : "Not Found", ct, respBody);
                }
            }
            catch { }
        }

        private static byte[] InjectExeMarker(byte[] htmlBytes)
        {
            try
            {
                string html = Encoding.UTF8.GetString(htmlBytes);
                const string marker = "<meta name=\"shadoudou-exe\" content=\"1\">";
                if (html.IndexOf("</head>", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    html = html.Replace("</head>", marker + "</head>");
                }
                else if (html.IndexOf("<!DOCTYPE html>", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    html = html.Replace("<!DOCTYPE html>", "<!DOCTYPE html>" + marker);
                }
                return Encoding.UTF8.GetBytes(html);
            }
            catch
            {
                return htmlBytes;
            }
        }

        private static byte[] ReadRequest(Stream stream)
        {
            var ms = new MemoryStream();
            byte[] buf = new byte[8192];
            int headerEnd = -1;
            int contentLength = 0;
            while (true)
            {
                int n = stream.Read(buf, 0, buf.Length);
                if (n <= 0) break;
                ms.Write(buf, 0, n);
                byte[] all = ms.ToArray();
                if (headerEnd < 0)
                {
                    headerEnd = IndexOfHeaderEnd(all);
                    if (headerEnd >= 0)
                    {
                        string headerText = Encoding.ASCII.GetString(all, 0, headerEnd);
                        contentLength = ParseContentLength(headerText);
                    }
                }
                if (headerEnd >= 0 && all.Length - (headerEnd + 4) >= contentLength) break;
            }
            return ms.ToArray();
        }

        private static int IndexOfHeaderEnd(byte[] data)
        {
            for (int i = 0; i + 3 < data.Length; i++)
            {
                if (data[i] == 13 && data[i + 1] == 10 && data[i + 2] == 13 && data[i + 3] == 10) return i;
            }
            return -1;
        }

        private static int ParseContentLength(string header)
        {
            string[] lines = header.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string ln in lines)
            {
                string t = ln.Trim();
                if (t.StartsWith("Content-Length:", StringComparison.OrdinalIgnoreCase))
                {
                    int v;
                    if (int.TryParse(t.Substring("Content-Length:".Length).Trim(), out v)) return v;
                }
            }
            return 0;
        }

        private static void ServeBytes(Stream stream, int status, string reason, string contentType, byte[] body)
        {
            string header = "HTTP/1.1 " + status + " " + reason + "\r\n"
                + "Content-Type: " + contentType + "\r\n"
                + "Content-Length: " + body.Length + "\r\n"
                + "Cache-Control: no-store\r\n"
                + "Connection: close\r\n\r\n";
            byte[] hb = Encoding.ASCII.GetBytes(header);
            stream.Write(hb, 0, hb.Length);
            stream.Write(body, 0, body.Length);
            stream.Flush();
        }

        private static string StorageFile()
        {
            string dir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "ShadoudouHabit");
            try { Directory.CreateDirectory(dir); } catch { }
            return Path.Combine(dir, "data.json");
        }

        private static byte[] ReadStorage()
        {
            lock (StorageLock)
            {
                try
                {
                    if (File.Exists(StorageFile())) return File.ReadAllBytes(StorageFile());
                }
                catch { }
            }
            return Encoding.UTF8.GetBytes("{\"habits\":[],\"records\":{}}");
        }

        private static void WriteStorage(byte[] body)
        {
            lock (StorageLock)
            {
                try { File.WriteAllBytes(StorageFile(), body); } catch { }
            }
        }

        private static Resource GetResource(string name)
        {
            Assembly asm = Assembly.GetExecutingAssembly();
            Stream s = asm.GetManifestResourceStream("app." + name);
            if (s == null) return null;
            using (s)
            using (var ms = new MemoryStream())
            {
                s.CopyTo(ms);
                var r = new Resource();
                r.Bytes = ms.ToArray();
                r.ContentType = ContentTypeFor(name);
                return r;
            }
        }

        private static string ContentTypeFor(string name)
        {
            if (name.EndsWith(".css")) return "text/css; charset=utf-8";
            if (name.EndsWith(".js")) return "application/javascript; charset=utf-8";
            if (name.EndsWith(".png")) return "image/png";
            if (name.EndsWith(".svg")) return "image/svg+xml";
            return "text/html; charset=utf-8";
        }
    }

    internal class AppHost : IDisposable
    {
        private readonly string _url;
        private readonly TinyHttpServer _server;
        private readonly string _debugPort;
        private Process _browser;
        private Thread _monitor;
        private volatile bool _exiting;
        private bool _titleCheck;

        public Form Form { get; private set; }

        public AppHost(string url, TinyHttpServer server, string debugPort)
        {
            _url = url;
            _server = server;
            _debugPort = debugPort;

            Form = new Form();
            Form.ShowInTaskbar = false;
            Form.WindowState = FormWindowState.Minimized;
            Form.Opacity = 0;
            Form.FormBorderStyle = FormBorderStyle.None;
            Form.StartPosition = FormStartPosition.Manual;
            Form.Location = new Point(-32000, -32000);
        }

        public void OpenBrowser()
        {
            if (_browser != null && !_browser.HasExited) return;

            string edge = FindEdge();
            if (edge != null)
            {
                _titleCheck = true;
                string userData = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "ShadoudouHabit");
                try { Directory.CreateDirectory(userData); } catch { }

                var psi = new ProcessStartInfo();
                psi.FileName = edge;
                psi.Arguments = "--app=\"" + _url + "\" --user-data-dir=\"" + userData
                    + "\" --no-first-run --no-default-browser-check";
                if (_debugPort != null && _debugPort.Length > 0)
                {
                    psi.Arguments += " --remote-debugging-port=" + _debugPort;
                }
                try { _browser = Process.Start(psi); } catch { _browser = null; }
            }
            else
            {
                _titleCheck = false;
                try { _browser = Process.Start(_url); } catch { _browser = null; }
            }

            if (_monitor == null && _browser != null)
            {
                _monitor = new Thread(MonitorLoop);
                _monitor.IsBackground = true;
                _monitor.Start();
            }
        }

        private void MonitorLoop()
        {
            bool sawWindow = false;
            int gone = 0;
            int neverSeenTicks = 0;
            while (!_exiting)
            {
                bool alive = _titleCheck
                    ? IsAppWindowVisible()
                    : (_browser != null && !_browser.HasExited);
                if (alive)
                {
                    sawWindow = true;
                    gone = 0;
                    neverSeenTicks = 0;
                }
                else if (sawWindow)
                {
                    gone++;
                    if (gone >= 4)
                    {
                        Shutdown();
                        return;
                    }
                }
                else
                {
                    // 启动宽限：Edge 首次启动会重建配置进程，旧进程退出不代表启动失败。
                    // 仅当浏览器进程已退出且窗口从未出现过（30 秒）才视为启动失败。
                    neverSeenTicks++;
                    if (_browser != null && _browser.HasExited && neverSeenTicks >= 60)
                    {
                        Shutdown();
                        return;
                    }
                }
                Thread.Sleep(500);
            }
        }

        private void Shutdown()
        {
            if (_exiting) return;
            _exiting = true;
            try { _server.Stop(); } catch { }
            try { Form.Invoke(new Action(() => Application.Exit())); } catch { }
        }

        private static bool IsAppWindowVisible()
        {
            foreach (Process p in Process.GetProcessesByName("msedge"))
            {
                try
                {
                    if (!string.IsNullOrEmpty(p.MainWindowTitle) &&
                        p.MainWindowTitle.IndexOf("傻豆豆的打卡日常", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        return true;
                    }
                }
                catch { }
            }
            return false;
        }

        public void Dispose() { }

        private static string FindEdge()
        {
            string[] candidates = {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft", "Edge", "Application", "msedge.exe")
            };
            foreach (string c in candidates)
            {
                if (File.Exists(c)) return c;
            }
            return null;
        }

    }
}
