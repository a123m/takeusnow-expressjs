const mysql = require('mysql2');

const pool = mysql.createPool({
  // host: "database-1.cisa2w1gawoz.ap-south-1.rds.amazonaws.com",
  host: 'sldb.ck8gk1zfzscd.ap-south-1.rds.amazonaws.com',
  user: 'root',
  password: 'takeusnow',
  database: 'SLDB',
  port: '3306',
  multipleStatements: true,
});

module.exports = pool.promise();
