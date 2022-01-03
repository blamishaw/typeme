echo "Building docker image registry.heroku.com/typeme-server/web:latest"
docker build -t registry.heroku.com/typeme-server/web:latest .

echo "Pushing image to heroku registry"
docker push registry.heroku.com/typeme-server/web:latest

echo "Releasing image on typeme-server dyno"
heroku container:release web -a typeme-server

heroku logs --tail -a typeme-server