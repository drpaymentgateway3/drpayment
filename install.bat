@echo off
echo.
echo 🚀 DrPayment Installation Script
echo ==================================

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js v14+
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo ✅ Installation complete!
echo.
echo 📝 Next steps:
echo 1. Create .env file: copy .env.example .env
echo 2. Setup database: psql -U postgres -d drpayment -f config/database.sql
echo 3. Start backend: npm start
echo 4. Start frontend: cd client ^&^& npm start
echo.
echo 🌐 Access at: http://localhost:3000
echo.
pause
