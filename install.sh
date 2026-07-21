#!/bin/bash

echo "🚀 DrPayment Installation Script"
echo "================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v14+"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create .env file: cp .env.example .env"
echo "2. Setup database: psql -U postgres -d drpayment -f config/database.sql"
echo "3. Start backend: npm start"
echo "4. Start frontend: cd client && npm start"
echo ""
echo "🌐 Access at: http://localhost:3000"
