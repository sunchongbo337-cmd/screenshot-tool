@echo off
setlocal

cd /d "%~dp0"

echo [start-all] starting server...
start "ScreenShot Server" cmd /k "cd /d \"%cd%\" && npm run dev:server"

echo [start-all] starting web...
start "ScreenShot Web" cmd /k "cd /d \"%cd%\" && npm run dev:web"

echo [start-all] done.
echo You can close this window.
endlocal
