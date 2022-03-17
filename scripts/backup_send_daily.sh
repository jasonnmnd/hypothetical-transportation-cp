DOW=$(date +%a)
echo "Sending $DOW daily backup"
scp -v -i ~/.ssh/id_rsa daily-$DOW.json vcm@vcm-25708.vm.duke.edu:backups/dev-host/daily/daily-$DOW.json
