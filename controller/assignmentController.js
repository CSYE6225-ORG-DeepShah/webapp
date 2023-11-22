const Assignment = require('../models/Assignment');
const StatsD = require('node-statsd');

const client = new StatsD({
    port: 8125,
    host: '127.0.0.1'
});

// Controller function to create a new assignment
const createAssignment = async (req, res) => {
  client.increment('createAssignment');
  try {
    const authUser = req.user;

    // Check if the request body contains unexpected fields
    const allowedFields = ['name', 'points', 'no_of_attempts', 'deadline'];
    const unexpectedFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

    if (unexpectedFields.length > 0) {
      return res.status(400).json({ error: "Invalid fields in request body", unexpectedFields });
    }

    const missingFields = allowedFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(400).json({ error: "Missing mandatory fields in request body", missingFields });
    }

    const { name, points, no_of_attempts, deadline } = req.body;

    // Additional check for integer values
    if (!Number.isInteger(points) || !Number.isInteger(no_of_attempts)) {
      return res.status(400).json({ error: "Points and no_of_attempts must be integers" });
    }

    const assignment = await Assignment.create({ name, points, no_of_attempts, deadline, userId: authUser.userID });

    res.status(201).json(assignment);
  } catch (err) {
    if(err.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: err.errors.map(e => e.message) });
    } else {
      res.status(500).json({ error: 'Error creating assignment' });
    }
  }
};

// Controller function to get all assignments belonging to the authenticated user
const getAllAssignment = async (req, res) => {
  client.increment('getAllAssignment');
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
  client.increment('getAssignmentById');
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
  client.increment('updateAssignment');
    try{
      const authUser = req.user;

      const assignment = await Assignment.findByPk(req.params.id);
      if(!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      if(assignment.userId !== authUser.userID) {
        return res.status(403).json({ error: 'Access Forbidden '});
      }

      // Check if the request body is empty
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body cannot be empty' });
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
  client.increment('deleteAssignment');
  try {
    const authUser = req.user;

    // Check if the request contains a body, and if so, reject the request
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({ error: 'DELETE request should not contain a body' });
    }

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