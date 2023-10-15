const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Assignment = require('./Assignment');

// Define the User model with its attributes and data types
const User = sequelize.define('user', {
    userID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
});

module.exports = User;
