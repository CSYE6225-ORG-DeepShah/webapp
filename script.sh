#!/bin/bash

sleep 30

sudo apt-get update

sudo apt-get install --reinstall unzip

echo "y" | sudo apt install nodejs

echo "y" | sudo apt install npm

sudo apt install -y mariadb-server

# Define the database name
MY_DATABASE=$MY_DATABASE

# Define the database password
MY_PASSWORD=$MY_PASSWORD

MY_USER=$MY_USER

Secure MySQL installation by setting the root password, removing anonymous users, etc.
sudo mysql_secure_installation <<EOF

y
$MY_PASSWORD
$MY_PASSWORD
y
y
y
y
EOF

if sudo mysql <<EOF
CREATE DATABASE $MY_DATABASE;
GRANT ALL PRIVILEGES ON $MY_DATABASE.* TO '$MY_USER'@'localhost' IDENTIFIED BY '$MY_PASSWORD';
FLUSH PRIVILEGES;
exit
EOF
then
  echo "Database $MY_DATABASE created successfully."
else
  echo "Failed to create database $MY_DATABASE."
fi

sudo mkdir deepshah

sudo mv /home/admin/webapp.zip /home/admin/deepshah/webapp.zip

sudo mv /home/admin/users.csv /home/admin/deepshah/users.csv

cd deepshah

sudo unzip -o webapp.zip

sudo npm cache clean --force

sudo npm install

sudo rm -rf node_modules
sudo rm package-lock.json

sudo npm install

sudo npm install bcrypt@latest --save







