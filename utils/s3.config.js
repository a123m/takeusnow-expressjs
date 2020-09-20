const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
  credentials: {
    accessKeyId: 'AKIA53PQ7GZK2E446TEG',
    secretAccessKey: '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',
  },
  region: 'ap-south-1',
});

const uploadParams = {
  Bucket: 'takeusnow-public',
  Key: '', // pass key
  Body: null, // pass file body
};

const deleteParams = {
  Bucket: 'takeusnow-public',
  Key: '', // pass key
};

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
s3.deleteParams = deleteParams;

module.exports = s3;
