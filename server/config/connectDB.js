const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smart-garden",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database successfully!");
});

module.exports = db;
