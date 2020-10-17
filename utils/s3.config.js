const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
  credentials: {
    accessKeyId: 'AKIA5QB2P7ULSRMO4FCI',
    secretAccessKey: '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',
  },
  region: 'ap-south-1',
});

const uploadParams = {
  Bucket: 'takeusnow-storage',
  Key: '', // pass key
  Body: null, // pass file body
};

const deleteParams = {
  Bucket: 'takeusnow-storage',
  Key: '', // pass key
};

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
s3.deleteParams = deleteParams;

module.exports = s3;
