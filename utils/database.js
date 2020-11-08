const mysql = require('mysql2');

/* Live server DB details */

const pool = mysql.createPool({
  host: 'sldb.ck8gk1zfzscd.ap-south-1.rds.amazonaws.com',
  user: 'root',
  password: 'takeusnow',
  database: 'SLDB',
  port: '3306',
  multipleStatements: true,
});

/* Local DB credentials */

// const pool = mysql.createPool({
//   host: 'localhost'
//   user: 'root',
//   password: 'asdfghjkl',
//   database: 'SLDB',
//   port: '3306',
//   multipleStatements: true,
// });

module.exports = pool.promise();
