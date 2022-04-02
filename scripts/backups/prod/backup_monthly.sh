# setup, no password
# ssh-keygen -t rsa
# ssh-copy-id vcm@vcm-25708.vm.duke.edu
MONTH=$(date +%m)

echo "[PROD: BACKUP - MONTHLY] dumping data"
sudo docker exec ece-458_web_1 python3 /code/manage.py dumpdata -o monthly.json

echo "[PROD: BACKUP - MONTHLY] copying data dump from db to dev server host"
sudo docker cp ece-458_web_1:monthly.json /home/vcm/backups/monthly.json

echo "[PROD: BACKUP - MONTHLY] copying data dump from dev server host to backup host"
scp -v -i /home/vcm/.ssh/id_rsa /home/vcm/backups/monthly.json vcm@vcm-25708.vm.duke.edu:/home/vcm/backups/prod-host/monthly/monthly-$MONTH.json
