const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Submission = sequelize.define('submission', {
    submissionID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: 'submission_date',
    updatedAt: 'submission_updated',
});

module.exports = Submission;