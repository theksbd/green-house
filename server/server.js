const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/connectDB");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const query = "SELECT * FROM `user`";
  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
