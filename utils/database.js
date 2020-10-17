const mysql = require('mysql2');

const pool = mysql.createPool({
  // host: "database-1.cisa2w1gawoz.ap-south-1.rds.amazonaws.com",
  // host: '127.0.0.1:3306',
  user: 'kaushal',
  password: '11223344',
  database: 'SLDB',
  port: '3306',
  multipleStatements: true,
});

module.exports = pool.promise();
