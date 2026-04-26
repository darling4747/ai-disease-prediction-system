@echo off
echo ============================================
echo AI Hospital Management System - Startup
echo ============================================
echo.
echo This will start all services:
echo   1. ML Service (Port 5000)
echo   2. Backend (Port 8080) 
echo   3. Frontend (Port 3000)
echo.
echo Prerequisites:
echo   - MongoDB must be running on port 27017
echo   - Java 17+ installed
echo   - Python with Flask installed
echo   - Node.js and npm installed
echo.
pause

echo.
echo [1/3] Starting ML Service...
start "ML Service - Port 5000" cmd /k "cd /d %~dp0ml-service\api && python simple_ml_api.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend...
start "Backend - Port 8080" cmd /k "cd /d %~dp0backend && mvnw spring-boot:run"

timeout /t 10 /nobreak >nul

echo [3/3] Starting Frontend...
start "Frontend - Port 3000" cmd /k "cd /d %~dp0frontend\hospital-management && npm start"

echo.
echo ============================================
echo All services starting...
echo Wait for each window to show "Started" message
echo.
echo Access points:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo   ML Service: http://localhost:5000
echo ============================================
pause
