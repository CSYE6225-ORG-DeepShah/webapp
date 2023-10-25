#!/bin/bash

sudo apt-get update

sudo apt-get install --reinstall unzip

echo "y" | sudo apt install nodejs

echo "y" | sudo apt install npm

sudo mkdir opt

sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip

sudo mv /home/admin/users.csv /home/admin/opt/users.csv

cd opt

sudo unzip -o webapp.zip

sudo npm cache clean --force

sudo npm install

sudo rm -rf node_modules
sudo rm package-lock.json

sudo npm install

sudo npm install bcrypt@latest --save