#!/bin/bash
cd /home/z/my-project

# Kill any existing processes
pkill -f "next dev" 2>/dev/null
sleep 2

# Start the server with explicit output
exec node node_modules/.bin/next dev -p 3000
