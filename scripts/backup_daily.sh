# setup, no password
# ssh-keygen -t rsa
# ssh-copy-id vcm@vcm-25708.vm.duke.edu
DOW=$(date +%a)
echo "[DAILY - $DOW] today is day $DOW in the week"

echo "[DAILY - $DOW] dumping data"
sudo docker exec -it ece-458_web_1 python3 /code/manage.py dumpdata -o daily.json

echo "[DAILY - $DOW] copying data dump from db to dev server host"
sudo docker cp ece-458_web_1:daily.json daily-$DOW.json

echo "[DAILY - $DOW] copying data dump from dev server host to backup host"
scp -i ~/.ssh/id_rsa daily-$DOW.json vcm@vcm-25708.vm.duke.edu:backups/dev-host/daily/daily-$DOW.json