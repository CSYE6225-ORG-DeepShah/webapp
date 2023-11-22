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

        // Check if the user is allowed to submit
        if (assignment.userId !== authUser.userID) {
            return res.status(403).json({ error: 'Access Forbidden' });
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

        // Check if the assignment has already been submitted
        const existingSubmission = await Submission.findOne({
            where: {
                assignmentId,
            }
        });

        if (existingSubmission) {
            // Update the existing submission with the new URL
            await existingSubmission.update({
                submission_url: req.body.submission_url,
            });

            // You can choose to send a notification or perform other actions here
            return res.status(204).json();
        }

        const { submission_url } = req.body;

        // Create a new submission
        const submission = await Submission.create({ 
            assignmentId,
            submission_url
        });
        console.log("created");
        
        // Post the URL to the SNS topic along with user info
        const snsMessage = {
            email: authUser.email,
            submissionUrl: submission_url,
        };

        await snsClient.send(
            new PublishCommand({
              Message: JSON.stringify(snsMessage),
              TopicArn: process.env.SNS_TOPIC_ARN,
            }),
        );

        res.status(201).json(submission);

    } catch (err) {
        console.error('Error publishing to SNS:', err);
        if(err.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Validation error', details: err.errors.map(e => e.message) });
        } else {
          res.status(500).json({ error: 'Error creating assignment' });
        }
    }
}

module.exports = { submitAssignment };