# setup, no password
# ssh-keygen -t rsa
# ssh-copy-id vcm@vcm-25708.vm.duke.edu
WEEK_01_53=$(date +%V)
WEEK_52=$(expr $WEEK_01_53 - 1)
WEEK=$(expr $WEEK_52 % 4)

echo "[BACKUP - WEEKLY] dumping data"
sudo docker exec -it ece-458_web_1 python3 /code/manage.py dumpdata -o weekly.json

echo "[BACKUP - WEEKLY] copying data dump from db to dev server host"
sudo docker cp ece-458_web_1:weekly.json /home/vcm/backups/weekly.json

echo "[BACKUP - WEEKLY] Sending $WEEK weekly backup"
scp -v -i ~/.ssh/id_rsa /home/vcm/backups/weekly.json vcm@vcm-25708.vm.duke.edu:/home/vcm/backups/prod-host/weekly/weekly-$WEEK.json
