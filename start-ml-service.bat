@echo off
echo ============================================
echo Starting ML Service (Random Forest Version)
echo ============================================
cd /d "%~dp0\ml-service\api"
python ml_api.py
pause
