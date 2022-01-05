echo $fg_bold[blue] "Updating websocket endpoint from dev to prod"
sed -i '' 's/process.env.REACT_APP_DEV_HOSTNAME/process.env.REACT_APP_WSS_HOSTNAME/' src/network/connect.js
head -n 10 src/network/connect.js

echo $fg_bold[blue] "Building docker image registry.heroku.com/typeme-app/web:latest"
docker build -t registry.heroku.com/typeme-app/web:latest .

echo $fg_bold[blue] "Pushing image to heroku registry"
docker push registry.heroku.com/typeme-app/web:latest

echo $fg_bold[blue] "Releasing image on typeme-app dyno"
heroku container:release web -a typeme-app

heroku logs --tail -a typeme-app