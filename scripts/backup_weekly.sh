# setup, no password
# ssh-keygen -t rsa
# ssh-copy-id vcm@vcm-25708.vm.duke.edu
WEEK_01_53=$(date +%V)
WEEK_52=$(expr $WEEK_01_53 - 1)
WEEK=$(expr $WEEK_52 % 4)

echo "[WEEKLY - $WEEK] dumping data"
sudo docker exec -it ece-458_web_1 python3 /code/manage.py dumpdata -o weekly.json

echo "[WEEKLY - $WEEK] copying data dump from db to dev server host"
sudo docker cp ece-458_web_1:weekly.json /home/vcm/weekly-$WEEK.json
