#!/bin/bash
cd /home/z/my-project
while true; do
    if ! pgrep -f "next-server" > /dev/null; then
        echo "[$(date)] Starting Next.js server..." >> /tmp/server-monitor.log
        node node_modules/.bin/next dev -p 3000 &
        sleep 10
    fi
    sleep 5
done
