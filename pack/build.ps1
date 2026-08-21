$ErrorActionPreference = 'Stop'

$csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path $csc)) {
  $csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe'
}
if (-not (Test-Path $csc)) {
  Write-Host '未找到 C# 编译器，请确认已安装 .NET Framework 4.x'
  exit 1
}

$pack = $PSScriptRoot
$root = (Resolve-Path (Join-Path $pack '..')).Path
$out = Join-Path $root '傻豆豆的打卡日常.exe'
$icon = Join-Path $pack 'icon.ico'
$src = Join-Path $pack 'Program.cs'

& $csc /nologo /target:winexe /codepage:65001 `
  "/out:$out" `
  "/win32icon:$icon" `
  "/resource:$(Join-Path $root 'index.html'),app.index.html" `
  "/resource:$(Join-Path $root 'styles.css'),app.styles.css" `
  "/resource:$(Join-Path $root 'app.js'),app.app.js" `
  /reference:System.Drawing.dll `
  /reference:System.Windows.Forms.dll `
  $src

if ($LASTEXITCODE -ne 0) {
  Write-Host '编译失败'
  exit 1
}

Write-Host "打包完成：$out"