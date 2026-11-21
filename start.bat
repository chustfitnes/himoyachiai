@echo off
echo ===================================================
echo           HimoyaAI Tizimini Ishga Tushirish
echo ===================================================
echo.
echo Eskirgan portlar tozalanmoqda (5173, 5174, 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

if exist node_modules\.vite rd /s /q node_modules\.vite >nul 2>&1

echo 1. Backend Server (Express port 3001) ishga tushmoqda...
start "HimoyaAI Backend (Port 3001)" cmd /k "npm run server"

echo 2. Frontend (Vite) ishga tushmoqda...
start "HimoyaAI Frontend (Vite)" cmd /k "npm run dev"

echo.
echo ===================================================
echo Tizim ishga tushdi!
echo Brauzerda oching: http://localhost:5173
echo ===================================================
