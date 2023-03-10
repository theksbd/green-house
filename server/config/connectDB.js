const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "green-garden",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database successfully!");
});

module.exports = db;
