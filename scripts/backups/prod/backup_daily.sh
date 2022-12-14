# setup, no password
# ssh-keygen -t rsa 
# ssh-copy-id vcm@vcm-25708.vm.duke.edu
DOW=$(date +%a)

echo "[PROD: BACKUP - DAILY] today is $DOW, starting daily backup"

echo "[PROD: BACKUP - DAILY] dumping data from inside web app"
sudo docker exec ece-458_web_1 python3 /code/manage.py dumpdata -o daily.json

echo "[PROD: BACKUP - DAILY] copying data dump from db to server host"
sudo docker cp ece-458_web_1:daily.json /home/vcm/backups/daily.json

echo "[PROD: BACKUP - DAILY] copying data dump from server host to backup host"
scp -v -i /home/vcm/.ssh/id_rsa /home/vcm/backups/daily.json vcm@vcm-25708.vm.duke.edu:/home/vcm/backups/prod-host/daily/daily-$DOW.json
