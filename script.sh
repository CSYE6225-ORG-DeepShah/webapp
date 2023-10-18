#!/bin/bash

sleep 30

sudo apt-get update

sudo apt-get install --reinstall unzip

echo "y" | sudo apt install nodejs

echo "y" | sudo apt install npm

sudo apt install -y mariadb-server






