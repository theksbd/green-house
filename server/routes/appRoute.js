const express = require("express");
const router = express.Router();
const db = require("../config/connectDB");
const { getUsers, login, getData } = require("../controllers/appController");

router.get("/", (req, res) => {
  res.send("Hello World from BE!");
});

router.post("/login", login);
router.get("/users", getUsers);
router.get("/data", getData);

module.exports = router;
