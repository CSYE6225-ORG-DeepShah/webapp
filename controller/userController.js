const fs = require('fs');
const csvParser = require('csv-parser');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Function to load CSV data and create users
const loadCSVDataAndCreateUsers = async () => {
  try {
    fs.createReadStream('./users.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        try {
          const { first_name, last_name, email, password } = row;
          const existingUser = await User.findOne({ where: { email }});
      
          if (!existingUser) {
            // If the user doesn't exist, hash the password and create a new user record
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ 
              first_name,
              last_name,
              email,
              password: hashedPassword,
             });
            console.log(`User created: ${row.email}`);
          } else {
            console.log(`User already exists: ${row.email}`);
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      })
      .on('end', async () => {
        console.log('Users created or updated successfully.');
      });
  } catch (error) {
    console.error('Error reading or processing the CSV file:', error);
  }
}

module.exports = {
  loadCSVDataAndCreateUsers,
};

