@echo off
title SportsEdge AI — Safe Bets & Sports Analytics
cd /d "%~dp0"
echo ========================================================
echo   SPORTSEDGE AI — SAFE BETS & SPORTS ANALYTICS
echo ========================================================
echo.
echo   [1] This PC:             http://localhost:3000/safe-bets
echo   [2] Phone / Home Wi-Fi:  http://10.0.0.7:3000/safe-bets
echo   [3] Share with Friends:  https://bettorsedge.pages.dev
echo ========================================================
echo.

:: Check if server is already running on port 3000
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 1; exit 0 } catch { exit 1 }"
if %ERRORLEVEL% EQU 0 (
    echo SportsEdge AI server is already running!
    echo Opening Safe Bets tab in default browser...
    start http://localhost:3000/safe-bets
    timeout /t 2 >nul
    exit /b
)

echo Starting SportsEdge AI server on 0.0.0.0:3000...
echo The browser will open automatically once the server is ready.
echo.

start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000/safe-bets"
npm.cmd run dev
pause
