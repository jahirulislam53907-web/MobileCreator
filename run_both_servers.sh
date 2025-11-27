#!/bin/bash

# এক command এ দুটি server একসাথে চালাবে
# Usage: bash run_both_servers.sh

echo "════════════════════════════════════════════"
echo "  Smart Muslim - Both Servers Starting"
echo "════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ] || [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory!"
    echo "   cd /home/runner/workspace first"
    exit 1
fi

echo "🚀 Starting Backend Server..."
echo "   Command: node server.js"
echo "   Port: 3000"
echo ""

# Start backend in background
node server.js &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

echo "🚀 Starting Frontend Server..."
echo "   Command: npm run dev"
echo "   Port: 8081"
echo ""

# Start frontend (this will be in foreground)
npm run dev

# When npm run dev exits, kill the backend
kill $BACKEND_PID 2>/dev/null

echo ""
echo "════════════════════════════════════════════"
echo "  Servers stopped"
echo "════════════════════════════════════════════"
