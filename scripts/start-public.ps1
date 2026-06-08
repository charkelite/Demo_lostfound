# 启动本地网站并通过 cpolar 生成公网访问链接
# 首次使用请先注册 cpolar 并配置 authtoken：
# 1. 打开 https://dashboard.cpolar.com/get-started
# 2. 复制 Authtoken
# 3. 运行：cpolar authtoken <你的token>

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Port = 5500
$CpolarExe = "C:\Program Files\cpolar\cpolar.exe"

Write-Host "项目目录: $ProjectRoot"
Write-Host "本地端口: $Port"
Write-Host ""

if (-not (Test-Path $CpolarExe)) {
    Write-Host "未找到 cpolar，请先安装。" -ForegroundColor Red
    exit 1
}

& $CpolarExe version | Write-Host

Write-Host ""
Write-Host "正在启动本地网站 http://localhost:$Port/html/home.html" -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$ProjectRoot'; python -m http.server $Port"
) | Out-Null

Start-Sleep -Seconds 2

Write-Host "正在启动 cpolar 公网隧道..." -ForegroundColor Cyan
Write-Host "请将下方 Forwarding 地址发给他人访问（入口一般为 /html/home.html）" -ForegroundColor Yellow
Write-Host ""

Set-Location $ProjectRoot
& $CpolarExe http $Port
