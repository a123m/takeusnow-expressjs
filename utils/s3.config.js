const AWS = require('aws-sdk');
require('dotenv').config();

const s3Client = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
});

const uploadParams = {
  Bucket: process.env.BUCKET,
  Key: '', // pass key
  Body: null, // pass file body
};

const deleteParams = {
  Bucket: process.env.BUCKET,
  Key: '', // pass key
};

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
s3.deleteParams = deleteParams;

module.exports = s3;
