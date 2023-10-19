const Assignment = require('../models/Assignment');

// Controller function to create a new assignment
const createAssignment = async (req, res) => {
  try {
    const authUser = req.user;

    // Check if the request body contains unexpected fields
    const allowedFields = ['name', 'points', 'no_of_attempts', 'deadline'];
    const unexpectedFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

    if (unexpectedFields.length > 0) {
      return res.status(400).json({ error: "Invalid fields in request body", unexpectedFields });
    }

    const { name, points, no_of_attempts, deadline } = req.body;

    const assignment = await Assignment.create({ name, points, no_of_attempts, deadline, userId: authUser.userID});

    res.status(201).json(assignment);
    console.log(assignment);
  } catch (err) {
    if(err.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error' });
    } else {
      res.status(500).json({ error: 'Error creating assignment' });
    }
  }
};

// Controller function to get all assignments belonging to the authenticated user
const getAllAssignment = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const assignments = await Assignment.findAll();

    const userAssignments = assignments.filter(assignment => assignment.createdBy === authUserId);

    res.status(200).json(userAssignments);
  } catch (err) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.error(err);
  }
};


// Controller function to get an assignment by its ID
const getAssignmentById = async (req, res) => {
  try{
    const authUser = req.user;

    const assignment = await Assignment.findByPk(req.params.id);
    if(!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    if(assignment.userId !== authUser.userID) {
      return res.status(403).json({ error: 'Access Forbidden '});
    }
    res.status(200).json(assignment);
  } catch(err) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.error(err);
  }
}

// Controller function to update an assignment by its ID
const updateAssignment = async (req, res) => {
    try{
      const authUser = req.user;

      const assignment = await Assignment.findByPk(req.params.id);
      if(!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      if(assignment.userId !== authUser.userID) {
        return res.status(403).json({ error: 'Access Forbidden '});
      }

      // Update the assignment with the provided data
      try {

        // Check if the request body contains unexpected fields
        const allowedFields = ['name', 'points', 'no_of_attempts', 'deadline'];
        const unexpectedFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

        if (unexpectedFields.length > 0) {
          return res.status(400).json({ error: "Invalid fields in request body", unexpectedFields });
        }

        await assignment.update(req.body, {
          fields: allowedFields, // Specify which fields to update
          validate: true, // Enable validation checks
        });
      } catch (validationErr) {
        res.status(400).json({ error: 'Validation error', details: validationErr.errors });
      }
    

      res.status(204).send();

    } catch(err) {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

    }
};

// Controller function to delete an assignment by its ID
const deleteAssignment = async (req, res) => {
  try {
    const authUser = req.user;

    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if(assignment.userId !== authUser.userID) {
      return res.status(403).json({ error: 'Access Forbidden '});
    }

    await assignment.destroy();
    res.status(204).send();
  } catch (err) {

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.error(err);

  }
};


module.exports = { createAssignment, updateAssignment, deleteAssignment, getAllAssignment, getAssignmentById};