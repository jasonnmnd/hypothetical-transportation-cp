# setup, no password
# ssh-keygen -t rsa
# ssh-copy-id vcm@vcm-25708.vm.duke.edu
MONTH=$(date +%m)

echo "[MONTHLY - $MONTH] dumping data"
sudo docker exec -it ece-458_web_1 python3 /code/manage.py dumpdata -o monthly.json

echo "[MONTHLY - $MONTH] copying data dump from db to dev server host"
sudo docker cp ece-458_web_1:monthly.json /home/vcm/monthly-$MONTH.json

echo "[MONTHLY - $MONTH] copying data dump from dev server host to backup host"
scp -i /home/vcm/.ssh/id_rsa /home/vcm/monthly-$MONTH.json vcm@vcm-25708.vm.duke.edu:/home/vcm/backups/dev-host/monthly/monthly-$MONTH.json
