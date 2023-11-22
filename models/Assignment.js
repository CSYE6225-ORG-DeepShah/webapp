const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./User');

// Define the Assignment model with its attributes and data types
const Assignment = sequelize.define('assignment', {
    assignmentID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10,
        }
    },
    no_of_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 3,
        }
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: 'assignment_created',
    updatedAt: 'assignment_updated',
});



module.exports = Assignment;
