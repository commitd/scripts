#!/bin/bash -e



RED='\033[0;31m'
NC='\033[0m' # No Color

echo "You must have LastPass CLI installed and PGP, and be logged into LastPass CLI"
echo "$ sudo apt-get install lastpass-cli gnupg"
echo "$ lpass login <username>"
echo "You will be further prompted for your master password due to the privileged nature of this operation"
echo 

NAME="lastpass-export-$(date +%Y%m%d)"
echo "Generating an encryption password the export and saving to a password called ${RED}${NAME}${NC} in your LastPass"
echo "This will replace any previous password of the same name"
PASSWORD=$(lpass generate ${NAME} 32)
echo 

FILE="${NAME}.csv.gpg"
lpass export --sync=now | gpg --batch --yes --output $FILE --passphrase $PASSWORD --symmetric 
echo 
echo -e "Saved lastpass export as ${RED}${FILE}${NC}"
echo "This file is encrypted, but you should store in somewhere safe (e.g. your private OneDrive https://committedio-my.sharepoint.com)"
echo "You may wish to record the password other than LastPass - it is no use if you are locked out of LastPass"
echo 
echo "To decrypt this file (pulling the password from lastpass) - you may wish to save this command"
SHOW_CMD="lpass show --password $NAME"
echo "$ gpg --batch --yes --output $NAME.csv --passphrase \$($SHOW_CMD) --decrypt ${FILE}"
echo
echo "You may want to log out of lastpass cli again (lpass logout)"