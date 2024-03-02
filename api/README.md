#Build imagem
docker build --network=host -t tuse-api-usuario .

#Run Imagem sem volume
docker run -dti --name test-api -p 8000:8000 test-api

docker run -dti --name test-api -p 443:443 test-api

docker run -dti --name test-api -p 80:8000 -p 443:8000 test-api

docker run -d -p 80:8000 -p 443:8000 \
  -v /etc/letsencrypt/live/tuse.com.br/fullchain.pem:/etc/letsencrypt/live/tuse.com.br/fullchain.pem \
  -v /etc/letsencrypt/live/tuse.com.br/privkey.pem:/etc/letsencrypt/live/tuse.com.br/privkey.pem \
  test-api

#Run Imagem com Volume Linux
docker run --env-file ../tuse-env/env_file_dev.env  -dti --name tuse-api-usuario -p 1095:8000 -v $(pwd):/app -v /app/__pycache__ tuse-api-usuario


