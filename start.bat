@echo off
setlocal
cd /d "%~dp0"

echo [INFO] 포트폴리오 서버를 시작합니다...
echo [INFO] 종료하려면 Ctrl + C 를 누르세요.
echo.

node server.mjs

