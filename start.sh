#!/bin/bash
cd /home/z/my-project
while true; do
    node_modules/.bin/next start -p 3000
    sleep 2
done
