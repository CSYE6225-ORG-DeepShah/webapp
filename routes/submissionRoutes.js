const express = require('express');
const sequelize = require('../database/database');
const submissionController = require('../controller/submissionController');
const authUser = require('../middleware/authMiddleware');
const router = express.Router();

// Authentication Route
router.use(authUser);

// Create a new assignment
router.post('/:id/submission', submissionController.submitAssignment);

module.exports = router;