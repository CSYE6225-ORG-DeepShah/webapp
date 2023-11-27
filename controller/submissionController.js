const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const StatsD = require('node-statsd');
const { PublishCommand } = require('@aws-sdk/client-sns');
const { snsClient, sns } = require('../aws/cloudwatch');

const client = new StatsD({
    port: 8125,
    host: '127.0.0.1'
});

const submitAssignment = async(req, res) => {
    client.increment('submitAssignment');
    try {
        const authUser = req.user;
        const assignmentId = req.params.id;

        const allowedFields = ['submission_url'];
        const unexpectedFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));

        if (unexpectedFields.length > 0) {
            return res.status(400).json({ error: "Invalid fields in request body", unexpectedFields });
        }

        // Check if the assignment exists   
        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        const submissionCount = await Submission.count({
            where: {
                assignmentId,
            }
        })

        if (submissionCount >= assignment.no_of_attempts) {
            return res.status(400).json({ error: 'Exceeded maximum number of attempts' });
        }

        // Check if the deadline has passed
        if (assignment.deadline && new Date(assignment.deadline) < new Date()) {
            return res.status(400).json({ error: 'Submission deadline has passed' });
        }

        const { submission_url } = req.body;

        // Validate the URL format
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

        if (!urlRegex.test(submission_url)) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // Create a new submission
        const submission = await Submission.create({ 
            assignmentId,
            submission_url
        });
    
        // Post the URL to the SNS topic along with user info
        const snsMessage = {
            email: authUser.email,
            submissionUrl: submission_url,
            assignmentID: assignmentId,
            attempts: submissionCount+1,
            assignmentName: assignment.name,
        };

        await snsClient.send(
            new PublishCommand({
              Message: JSON.stringify(snsMessage),
              TopicArn: process.env.SNS_TOPIC_ARN,
            }),
        );

        res.status(201).json(submission);

    } catch (err) {
        if(err.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Validation error', details: err.errors.map(e => e.message) });
        } else {
          res.status(500).json({ error: 'Error creating assignment' });
        }
    }
}

module.exports = { submitAssignment };