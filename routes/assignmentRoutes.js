const express = require('express');
const sequelize = require('../database/database');
const assignmentController = require('../controller/assignmentController');
const authUser = require('../middleware/authMiddleware');
const router = express.Router();

// Authentication Route
router.use(authUser);

// Get all assignments
router.get('/', assignmentController.getAllAssignment);

// Get assignments By Id
router.get('/:id', assignmentController.getAssignmentById);

// Create a new assignment
router.post('/', authUser, assignmentController.createAssignment);

// Update an existing assignment
router.put('/:id', assignmentController.updateAssignment);

// Delete an existing assignment
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;