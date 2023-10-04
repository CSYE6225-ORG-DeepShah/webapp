const express = require('express');
const { loadCSVDataAndCreateUsers } = require('./controller/userController');
const sequelize = require('./database/database');
const User = require('./models/User');
const assignmentRoute = require('./routes/assignmentRoutes');
const healthRoute = require('./routes/healthRoutes');
const bodyParser = require('body-parser');
const Assignment = require('./models/Assignment');


const app = express();

// Middleware: Parse incoming JSON requests
app.use(bodyParser.json());

const PORT = 8080;



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
