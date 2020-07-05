const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "database-1.cisa2w1gawoz.ap-south-1.rds.amazonaws.com",
  user: "DevAdmin",
  password: "FhGfc5QRf5uSJURxeSqe",
  database: "SLDB"
});

module.exports = pool.promise();
