#!/bin/zsh
autoload colors && colors
PRINT_MSG () {
    echo $fg_bold[yellow] "$1"
}

echo "latest built: $(date -u '+%Y-%m-%d -- %H:%M:%S GMT')"  > manifest.txt

PRINT_MSG "STEP [1/4] Updating websocket endpoint from dev to prod"
sed -i '' 's/process.env.REACT_APP_DEV_HOSTNAME/process.env.REACT_APP_WSS_HOSTNAME/' src/network/connect.js
head -n 10 src/network/connect.js

PRINT_MSG "STEP [2/4] Building docker image registry.heroku.com/typeme-app/web:latest"
docker build -t registry.heroku.com/typeme-app/web:latest .

PRINT_MSG "STEP [3/4] Pushing image to heroku registry"
docker push registry.heroku.com/typeme-app/web:latest

PRINT_MSG "Resetting websocket endpoint to dev"
sed -i '' 's/process.env.REACT_APP_WSS_HOSTNAME/process.env.REACT_APP_DEV_HOSTNAME/' src/network/connect.js
head -n 10 src/network/connect.js

PRINT_MSG "STEP [4/4] Releasing image on typeme-app dyno"
heroku container:release web -a typeme-app

heroku logs --tail -a typeme-app