@echo off
echo ============================================
echo AI Hospital Management System - Public Tunnel Startup
echo ============================================
echo.
echo This will start all services and open a public tunnel with a fixed subdomain.
echo Prerequisites:
echo   - MongoDB must be running on port 27017
echo   - Java 17+ installed
echo   - Python with Flask installed
echo   - Node.js and npm installed
echo.
pause

echo.
echo [1/4] Starting ML Service...
start "ML Service - Port 5000" cmd /k "cd /d %~dp0ml-service\api && python ml_api.py"

timeout /t 3 /nobreak >nul

echo [2/4] Starting Backend...
start "Backend - Port 8080" cmd /k "cd /d %~dp0backend && mvnw spring-boot:run"

timeout /t 10 /nobreak >nul

echo [3/4] Starting Frontend...
start "Frontend - Port 3001" cmd /k "cd /d %~dp0frontend\hospital-management && npm run start:lan"

timeout /t 10 /nobreak >nul

echo [4/4] Opening public tunnel...
start "Public Tunnel" cmd /k "cd /d %~dp0 && npx localtunnel --port 3001 --local-host 127.0.0.1 --subdomain hospital-management-idp"

timeout /t 5 /nobreak >nul
start "Open Login Page" "https://hospital-management-idp.loca.lt/login"
echo.
echo ============================================
echo All services starting with public tunnel.
echo If the chosen subdomain is already taken, change --subdomain hospital-management-idp.
echo ============================================
pause
