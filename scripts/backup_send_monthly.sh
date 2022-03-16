MONTH=$(date +%m)
echo "Sending $MONTH monthly backup"
scp -v -i ~/.ssh/id_rsa monthly-$MONTH.json vcm@vcm-25708.vm.duke.edu:backups/dev-host/monthly/monthly-$MONTH.json
