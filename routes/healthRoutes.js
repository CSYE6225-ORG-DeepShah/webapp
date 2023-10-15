const express = require('express');
const sequelize = require('../database/database');

const router = express.Router();


// Define a health check route to verify the database connection
router.get('/healthz',  async (req,res) => {
    try{
        await sequelize.authenticate();
        res.status(200).json();
        console.log('Connection has been established successfully');
    } catch(err) {
        res.status(503).json();
        console.error('Unable to connect to database', err);
    }
});


module.exports = router;