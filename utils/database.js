const mysql = require('mysql2');

const pool = mysql.createPool({
<<<<<<< HEAD
  // host: "database-1.cisa2w1gawoz.ap-south-1.rds.amazonaws.com",
  // host: '127.0.0.1:3306',
  user: 'kaushal',
  password: '11223344',
=======
  host: 'sldb.ck8gk1zfzscd.ap-south-1.rds.amazonaws.com',
  user: 'root',
  password: 'takeusnow',
>>>>>>> 9d74c1b46c61c5cf6798f883dbe046c3eb1fc5b5
  database: 'SLDB',
  port: '3306',
  multipleStatements: true,
});

module.exports = pool.promise();
