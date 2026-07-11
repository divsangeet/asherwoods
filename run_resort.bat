@echo off
title Asherwoods Mountain Resort Launchpad
echo ==========================================================
echo           Asherwoods Cafe ^& Cottages Developer Launch
echo ==========================================================
echo.
where node >nul 2>nul
if %errorlevel%==0 (
    echo [OK] Node.js found. Installing libraries and running compiler...
    call npm install
    call npm run dev
) else (
    echo [WARNING] Node.js not found in system PATH.
    echo Launching Python fallback server on http://localhost:3000...
    start http://localhost:3000
    python -m http.server 3000
)
pause
