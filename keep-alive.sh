#!/bin/bash
cd /home/z/my-project
while true; do
    if ! pgrep -f "next-server" > /dev/null; then
        echo "Server not running, starting at $(date)" >> /tmp/keep-alive.log
        bun run dev >> /tmp/keep-alive.log 2>&1 &
        sleep 5
    fi
    sleep 3
done
