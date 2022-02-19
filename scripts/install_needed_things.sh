/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.profile
# eval "$(/opt/homebrew/bin/brew shellenv)"
brew install postgresql
brew services restart postgresql
brew install npm
npm install webpack
brew install pip
pip3 install psycopg2-binary
# download postgresql if you can't login using using postgres
cd ../
pip install -r requirements.txt