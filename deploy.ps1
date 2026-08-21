param(
  [string]$RepoName = "shadoudou-habit-tracker"
)

$ErrorActionPreference = 'Stop'

$token = $env:GITHUB_TOKEN
if (-not $token) {
  Write-Host "请先设置 GITHUB_TOKEN 环境变量（GitHub Personal Access Token，需 repo 权限）。"
  Write-Host '示例：在 PowerShell 中执行  $env:GITHUB_TOKEN="你的令牌"  后再运行本脚本。'
  exit 1
}

$headers = @{ Authorization = "token $token"; Accept = 'application/vnd.github+json' }

# 获取用户名
$user = (Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers).login
Write-Host "GitHub 用户：$user"

# 创建公开仓库（已存在则跳过）
try {
  Invoke-RestMethod -Method Post -Uri 'https://api.github.com/user/repos' -Headers $headers `
    -ContentType 'application/json' `
    -Body (@{ name = $RepoName; private = $false; description = '傻豆豆的打卡日常：古风习惯打卡小站（PWA + exe）' } | ConvertTo-Json) `
    | Out-Null
  Write-Host "已创建仓库：$RepoName"
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 422) {
    Write-Host "仓库已存在：$RepoName"
  } else {
    throw
  }
}

# 推送
$origin = "https://github.com/$user/$RepoName.git"
$existing = git remote get-url origin 2>$null
if (-not $existing) {
  git remote add origin $origin
} elseif ($existing -ne $origin) {
  git remote set-url origin $origin
}
git push -u origin main
Write-Host '推送完成'

# 开启 GitHub Pages（从 main 分支根目录发布）
try {
  Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$user/$RepoName/pages" -Headers $headers `
    -ContentType 'application/json' `
    -Body (@{ source = @{ branch = 'main'; path = '/' } } | ConvertTo-Json -Depth 5) `
    | Out-Null
  Write-Host '已开启 GitHub Pages'
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 409) {
    Write-Host 'GitHub Pages 已开启'
  } else {
    Write-Host ('开启 Pages 失败：' + $_.Exception.Message)
  }
}

Write-Host "部署地址：https://$user.github.io/$RepoName/"
Write-Host 'iPhone 用 Safari 打开上述地址 → 分享 → 添加到主屏幕即可安装。'
