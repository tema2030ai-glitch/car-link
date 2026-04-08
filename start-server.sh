#!/bin/bash
cd /home/z/my-project
while true; do
    echo "Starting server at $(date)"
    bun run dev
    echo "Server stopped at $(date), restarting in 2 seconds..."
    sleep 2
done
