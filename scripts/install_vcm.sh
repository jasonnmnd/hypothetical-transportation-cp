sudo apt update
echo 'install curl'
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common --yes
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu  $(lsb_release -cs)  stable"
sudo apt update

echo 'install docker'
sudo apt-get install docker-ce --yes
docker --version
sudo systemctl start docker

echo 'run docker at startup'
sudo systemctl enable docker

echo 'check system status of docker'
sudo systemctl status docker

echo 'install docker-compose'
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo 'install snap, this is for letsencrypt'
# https://certbot.eff.org/instructions?ws=webproduct&os=ubuntufocal
sudo apt update
sudo apt install snapd --yes
echo ''
sudo snap install core; sudo snap refresh core
echo ''
sudo snap install --classic certbot

echo 'setup cert for the host'
sudo certbot certonly --standalone --email dmm107@duke.edu --agree-tos --no-eff-email -d whateverdomain.changeme1,whateverdomain.changeme2