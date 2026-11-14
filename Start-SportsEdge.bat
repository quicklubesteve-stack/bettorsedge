@echo off
title SportsEdge AI — Advanced Sports Analytics
cd /d "%~dp0"
echo ========================================================
echo   SPORTSEDGE AI — ADVANCED PRO ANALYTICS PLATFORM
echo ========================================================
echo.
echo Starting local development server on http://localhost:3000...
echo Opening SportsEdge AI in your browser...
start "" http://localhost:3000
echo.
npm.cmd run dev
pause
