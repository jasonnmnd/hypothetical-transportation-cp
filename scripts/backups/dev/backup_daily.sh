# setup, no password
# ssh-keygen -t rsa 
# ssh-copy-id vcm@vcm-25708.vm.duke.edu
DOW=$(date +%a)
echo "[BACKUP - DAILY] today is $DOW, starting daily backup"

echo "[BACKUP - DAILY] dumping data from inside web app"
sudo docker exec ece-458_web_1 python3 /code/manage.py dumpdata -o daily.json

echo "[BACKUP - DAILY] copying data dump from db to server host"
sudo docker cp ece-458_web_1:daily.json /home/vcm/daily.json

SSH_CONNECTION=$(ip route get 8.8.8.8 | grep -oP 'src \K[^ ]+')
echo "i am $SSH_CONNECTION"

echo "[BACKUP - DAILY] copying data dump from server host to backup host"
scp -v -i /home/vcm/.ssh/id_rsa /home/vcm/daily.json vcm@vcm-25708.vm.duke.edu:/home/vcm/backups/dev-host/daily/daily-$DOW.json
