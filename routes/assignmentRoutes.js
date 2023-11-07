const express = require('express');
const sequelize = require('../database/database');
const assignmentController = require('../controller/assignmentController');
const authUser = require('../middleware/authMiddleware');
const router = express.Router();
const count = require('../aws/cloudwatch');

// Authentication Route
router.use(authUser);

// Get all assignments
router.get('/', count.incrementAPICallMetric('getAllAssignment'), assignmentController.getAllAssignment);

// Get assignments By Id
router.get('/:id', count.incrementAPICallMetric('getAssignmentById'), assignmentController.getAssignmentById);

// Create a new assignment
router.post('/', count.incrementAPICallMetric('createAssignment'), assignmentController.createAssignment);

// Update an existing assignment
router.put('/:id', count.incrementAPICallMetric('updateAssignment'), assignmentController.updateAssignment);

// Delete an existing assignment
router.delete('/:id', count.incrementAPICallMetric('deleteAssignment'), assignmentController.deleteAssignment);

module.exports = router;