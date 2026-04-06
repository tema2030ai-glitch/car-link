#!/bin/bash
cd /home/z/my-project
while true; do
    echo "Starting server at $(date)" >> /home/z/my-project/server-watchdog.log
    bun run dev 2>&1 | tee /home/z/my-project/dev.log
    echo "Server stopped at $(date)" >> /home/z/my-project/server-watchdog.log
    sleep 2
done
