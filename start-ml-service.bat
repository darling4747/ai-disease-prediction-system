@echo off
echo ============================================
echo Starting ML Service (Simple Version)
echo ============================================
cd /d "%~dp0\ml-service\api"
python simple_ml_api.py
pause
