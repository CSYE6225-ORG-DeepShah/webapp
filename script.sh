#!/bin/bash

sleep 30

sudo apt-get update

sudo apt-get install --reinstall unzip

echo "y" | sudo apt install nodejs

echo "y" | sudo apt install npm

sudo apt install -y mariadb-server
     
# # Access the environment variable in your script
# mysql_root_password="$mysql_root_password"
# mysql_database="$mysql_database"

# Define the database name
MY_DATABASE=$MY_DATABASE

# Define the database password
MY_PASSWORD=$MY_PASSWORD

# Secure MySQL installation by setting the root password, removing anonymous users, etc.
sudo mysql_secure_installation <<EOF

y
$MY_PASSWORD
$MY_PASSWORD
y
y
y
y
EOF

if sudo mariadb <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS $MY_DATABASE;
MYSQL_SCRIPT
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

sudo npm i







