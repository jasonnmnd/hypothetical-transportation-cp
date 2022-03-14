WEEK_01_53=$(date +%V)
WEEK_52=$(expr $WEEK_01_53 - 1)
WEEK=$(expr $WEEK_52 % 4)

echo "Sending $WEEK weekly backup"
scp -v -i ~/.ssh/id_rsa weekly-$WEEK.json vcm@vcm-25708.vm.duke.edu:backups/dev-host/weekly/weekly-$WEEK.json
