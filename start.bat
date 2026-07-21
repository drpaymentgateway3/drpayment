@echo off
echo.
echo 🚀 DrPayment Start Script
echo ========================
echo.

echo Starting backend server...
start "Backend" npm start

echo Waiting for backend to start...
timeout /t 5 /nobreak

echo Starting frontend...
cd client
start "Frontend" npm start

echo.
echo ✅ DrPayment is running!
echo.
echo 📌 Frontend: http://localhost:3000
echo 📌 Backend API: http://localhost:5000
echo 📌 API Docs: http://localhost:5000/api/documentation
echo.
echo.Press Ctrl+C in either window to stop
echo.

pause
