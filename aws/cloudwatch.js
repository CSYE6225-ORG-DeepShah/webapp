const AWS = require('aws-sdk');

// Initialize AWS SDK
AWS.config.update({ region: 'us-east-1' });
const cloudWatchLogs = new AWS.CloudWatchLogs();

let count = 0;

const cloudwatch = new AWS.CloudWatch();
const incrementAPICallMetric = (apiName) => async (req, res, next) => {
    count++;

    cloudwatch.putMetricData({
      MetricData: [
        {
          MetricName: 'APICalls',
          Dimensions: [
            {
              Name: 'APIName',
              Value: apiName,
            },
          ],
          Unit: 'Count',
          Value: count,
        },
      ],
      Namespace: 'YourNamespace', 
    }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Custom metric updated for ${apiName}`);
        console.log(count);
      }
    });
  
    next();
  };

module.exports = { cloudWatchLogs, incrementAPICallMetric };