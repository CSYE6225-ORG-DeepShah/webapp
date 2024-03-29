#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install --reinstall unzip
echo "y" | sudo apt install nodejs
echo "y" | sudo apt install npm

sudo wget https://s3.us-east-1.amazonaws.com/amazoncloudwatch-agent-us-east-1/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
# sudo mkdir opt
sudo mv /home/admin/webapp.zip /opt/csye6225/webapp.zip
sudo mv /home/admin/users.csv /opt/csye6225/users.csv
cd /opt/csye6225
sudo unzip -o webapp.zip
sudo npm cache clean --force
sudo npm install
sudo rm -rf node_modules
sudo rm package-lock.json
sudo npm install
sudo npm install bcrypt@latest --save

sudo mv /home/admin/amazon-cloudwatch-agent.json /opt/csye6225/amazon-cloudwatch-agent.json
sudo mv /home/admin/csye6225.service /etc/systemd/system
systemctl daemon-reload

sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent

sudo systemctl enable csye6225.service
sudo systemctl start csye6225.service
#
#