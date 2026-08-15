@echo off
chcp 65001 > nul
setlocal
cd /d "%~dp0"

echo ===================================================
echo   Portfolio Local Server
echo   http://127.0.0.1:4173/
echo ===================================================
echo [INFO] 포트폴리오 로컬 서버를 시작합니다...
echo [INFO] 종료하려면 Ctrl + C 를 누르세요.
echo.

node server.mjs
