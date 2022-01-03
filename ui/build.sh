echo "Building docker image registry.heroku.com/typeme-app/web:latest"
docker build -t registry.heroku.com/typeme-app/web:latest .

echo "Pushing image to heroku registry"
docker push registry.heroku.com/typeme-app/web:latest

echo "Releasing image on typeme-app dyno"
heroku container:release web -a typeme-app

heroku logs --tail -a typeme-app