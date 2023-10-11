const express = require('express');
const sequelize = require('../database/database');

const router = express.Router();

// Middleware: Check for valid content-length in GET requests
router.use((req,res,next) => {
    
    if (req.method === 'GET' && req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
        return res.status(400).json();
    }

    next(); 
})

// Define a health check route to verify the database connection
router.get('/healthz',  async (req,res) => {
    try{
        await sequelize.authenticate();

        res.status(400).json();
     
        console.log('Connection has been established successfully');
    } catch(err) {
        res.status(503).json();
        console.error('Unable to connect to database', err);
    }
});


module.exports = router;