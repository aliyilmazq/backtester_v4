#!/bin/bash

# Kill any existing processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Kill any existing node processes
pkill -f "react-scripts" 2>/dev/null || true

# Clear npm cache if needed
npm cache clean --force 2>/dev/null || true

# Set environment variables
export BROWSER=none
export DISABLE_ESLINT_PLUGIN=true
export PORT=3000

# Start the app
echo "Starting Citalf Trading Platform on http://localhost:3000"
npm start