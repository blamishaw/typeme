echo $fg_bold[blue] "Building docker image registry.heroku.com/typeme-server/web:latest"
docker build -t registry.heroku.com/typeme-server/web:latest .

echo $fg_bold[blue] "Pushing image to heroku registry"
docker push registry.heroku.com/typeme-server/web:latest

echo $fg_bold[blue] "Releasing image on typeme-server dyno"
heroku container:release web -a typeme-server

heroku logs --tail -a typeme-server