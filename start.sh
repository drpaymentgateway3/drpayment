#!/bin/bash

echo "🚀 DrPayment Start Script"
echo "========================"

# Start backend in background
echo "Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting frontend..."
cd client
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ DrPayment is running!"
echo ""
echo "📌 Frontend: http://localhost:3000"
echo "📌 Backend API: http://localhost:5000"
echo "📌 API Docs: http://localhost:5000/api/documentation"
echo ""
echo "Press Ctrl+C to stop..."
echo ""

wait $BACKEND_PID $FRONTEND_PID
