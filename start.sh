npm install
pm2 start ./src/"$1" --watch --ignore-watch="node_modules .git"
