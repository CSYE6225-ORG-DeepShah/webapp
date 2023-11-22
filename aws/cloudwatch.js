const AWS = require('aws-sdk');
const { SNSClient } = require('@aws-sdk/client-sns');


// Initialize AWS SDK
AWS.config.update({ region: 'us-east-1' });
const cloudWatchLogs = new AWS.CloudWatchLogs();
const snsClient = new SNSClient({ region: 'us-east-1' });

module.exports = { cloudWatchLogs, snsClient };