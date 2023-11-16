const express = require('express');
const sequelize = require('../database/database');
const assignmentController = require('../controller/assignmentController');
const authUser = require('../middleware/authMiddleware');
const router = express.Router();
const statsD = require('node-statsd');

const statsd = new statsD({
    port: 8125,
    host: '127.0.0.1',
})

// Authentication Route
router.use(authUser);

// Get all assignments
router.get('/', statsd.increment('getAllAssignment'), assignmentController.getAllAssignment);

// Get assignments By Id
router.get('/:id', statsd.increment('getAssignmentById'), assignmentController.getAssignmentById);

// Create a new assignment
router.post('/', statsd.increment('createAssignment'), assignmentController.createAssignment);

// Update an existing assignment
router.put('/:id', statsd.increment('updateAssignment'), assignmentController.updateAssignment);

// Delete an existing assignment
router.delete('/:id', statsd.increment('deleteAssignment'), assignmentController.deleteAssignment);

module.exports = router;