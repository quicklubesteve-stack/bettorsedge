@echo off
title SportsEdge AI — Advanced Sports Analytics
cd /d "%~dp0"
echo ========================================================
echo   SPORTSEDGE AI — ADVANCED PRO ANALYTICS PLATFORM
echo ========================================================
echo.
echo Starting SportsEdge AI server on http://localhost:3000...
echo The browser will open automatically once the server is ready.
echo.

:: Wait 4 seconds for server socket initialization before opening the browser
start "" /b cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"

npm.cmd run dev
pause
