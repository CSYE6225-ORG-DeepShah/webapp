const express = require('express');
const sequelize = require('../database/database');
const statsD = require('node-statsd');

const router = express.Router();

const statsd = new statsD({
    port: 8125,
    host: '127.0.0.1',
})



// Define a health check route to verify the database connection
router.get('/healthz', statsd.increment('healthz'), async (req,res) => {
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