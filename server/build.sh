#!/bin/zsh
autoload colors && colors
PRINT_MSG () {
    echo $fg_bold[yellow] "$1"
}

PRINT_MSG "STEP [1/3] Building docker image registry.heroku.com/typeme-server/web:latest"
docker build -t registry.heroku.com/typeme-server/web:latest .

PRINT_MSG "STEP [2/3] Pushing image to heroku registry"
docker push registry.heroku.com/typeme-server/web:latest

PRINT_MSG "STEP [3/3] Releasing image on typeme-server dyno"
heroku container:release web -a typeme-server

heroku logs --tail -a typeme-server