@echo off
echo.
echo  ========================================
echo    CardMitra - Starting All Services
echo  ========================================
echo.
echo  [1/2] Starting Backend API (port 3001)...
start "CardMitra API" cmd /k "cd /d "%~dp0server" && node index.js"

timeout /t 2 /nobreak > nul

echo  [2/2] Starting Frontend (port 5173)...
start "CardMitra Frontend" cmd /k "cd /d "%~dp0cardmitra" && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo  ========================================
echo    CardMitra is running!
echo    Frontend : http://localhost:5173
echo    Backend  : http://localhost:3001
echo  ========================================
echo.
start "" "http://localhost:5173"
