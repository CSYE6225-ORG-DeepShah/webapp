const express = require('express');
const { loadCSVDataAndCreateUsers } = require('./controller/userController');
const sequelize = require('./database/database');
const User = require('./models/User');
const assignmentRoute = require('./routes/assignmentRoutes');
const healthRoute = require('./routes/healthRoutes');
const bodyParser = require('body-parser');
const Assignment = require('./models/Assignment');
require('dotenv').config();



const app = express();

// Middleware: Parse incoming JSON requests
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;


app.use((req,res,next) => {
    
    // if (req.method === 'GET' && req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
    //     return res.status(400).json();
    // }
    if(req.method === 'PATCH') {
        return res.status(405).json();
    }

    if (req.method === 'GET' && (Object.keys(req.query).length > 0 || req.headers['content-length'] || Object.keys(req.body).length > 0)) {
        // Return a 400 Bad Request if query parameters or request/response body are present
        return res.status(400).json();
      }

    next(); 
})



app.use('/', healthRoute);
app.use('/v1/assignments', assignmentRoute);

// Define a relationship between the User and Assignment models
User.hasMany(Assignment, { as: 'assignment' });
Assignment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
})

// Sync the Sequelize database and start the server
sequelize.sync().then((result) => {
    console.log(result);
    loadCSVDataAndCreateUsers();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
