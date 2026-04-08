#!/bin/bash
while true; do
    if ! pgrep -f "next-server" > /dev/null; then
        cd /home/z/my-project
        pkill -f "next dev" 2>/dev/null
        sleep 2
        setsid node node_modules/.bin/next dev -p 3000 < /dev/null > /tmp/next.log 2>&1 &
        echo "[$(date)] Server restarted" >> /tmp/monitor.log
        sleep 10
    fi
    sleep 3
done
