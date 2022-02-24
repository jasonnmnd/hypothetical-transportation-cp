#!/bin/sh

sudo docker-compose -f /home/vcm/ece-458/docker-compose.prod.yml pull
sudo docker-compose -f /home/vcm/ece-458/docker-compose.prod.yml up -d --build