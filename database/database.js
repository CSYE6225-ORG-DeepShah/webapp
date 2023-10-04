const dbConfig = require('../config/config');

const { Sequelize } = require('sequelize');


// Create a new instance of Sequelize with the database configuration
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
});


module.exports = sequelize;