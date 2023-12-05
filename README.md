# webapp

## Command to Import the Certificate to AWS.
aws acm import-certificate --certificate fileb://certificate.pem --certificate-chain fileb://certificate-chain.pem --private-key fileb://privateKey.pem

## Run application locally
1. Install node.js in your local machine.
   Use npm install -g npm

2. Set Path
   <Your_Directory>/github.com/<username>

3. Set up MySql using homebrew in MacOS
   brew install mysql

4. Clone the github repo to the Set Path in Point2
   git clone git@github.com:DeepShah1108/webapp.git

5. Create config file for MYSQL as
   HOST: 'localhost',
    USER: 'root',
    PASSWORD: '<your_password>',
    DB: '<your_database_name>',
    dialect: 'mysql',

6. Install all the dependencies
   npm install

7. Run the server
   npm start

8. To test the Testfile
   npm test


## How to run the application in DigitalOcean
1. Create a droplet in Digital Ocean and note the Ip.

2. Make a directory in DigitalOcean
   mkdir -p <project_directory_name>

3. Execute it on the local terminal with secure copy
   scp -i <path_to_private_ssh_key> -r <project_directory_name> root@<droplet_IP>:/root/github.com/<username>

4. Setup up the project on Droplet
    #Navigate to directory
    cd <project_directory>

    #Install MariaDB on DidgitalOcean for MySQL user
    sudo apt update
    sudo apt install mariadb-server
    sudo mysql_secure_installation

    #Install Node
    npm install -g npm

    #Install dependencies
    npm install

    #Run server
    npm start

    #Run Test
    npm test
       
