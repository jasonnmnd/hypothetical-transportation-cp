#!/bin/sh
echo "pull docker image"
sudo docker-compose -f /home/vcm/ece-458/docker-compose.prod.yml pull
echo "put up docker compose file"
sudo docker-compose -f /home/vcm/ece-458/docker-compose.prod.yml up -d --build
echo "copy in pg config, even tho this is already in the volume"
sudo docker cp /home/vcm/ece-458/postgres/pg_hba.conf ece-458_db_1:var/lib/postgresql/data/pg_hba.conf
echo "survived reboot"
