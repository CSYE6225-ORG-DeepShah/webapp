const express = require('express');
const sequelize = require('../database/database');
const router = express.Router();
const StatsD = require('node-statsd');

const client = new StatsD({
    port: 8125,
    host: '127.0.0.1'
});



// Define a health check route to verify the database connection
router.get('/healthz', async (req,res) => {
    client.increment('healthz');
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