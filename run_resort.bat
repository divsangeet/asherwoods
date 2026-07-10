@echo off
echo =====================================================================
echo    Asherwoods Cafe & Cottages - Starting Premium Luxury Resort Site
echo =====================================================================
echo.
echo Running on Python local server...
echo opening: http://localhost:3000
echo.
start "" "http://localhost:3000"
python -m http.server 3000
pause
