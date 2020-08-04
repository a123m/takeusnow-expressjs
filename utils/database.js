const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "database-1.ccejucbp66ft.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "snaplancing123",
  database: "SLDB"
});

module.exports = pool.promise();
