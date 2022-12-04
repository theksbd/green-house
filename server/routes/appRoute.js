const express = require("express");
const router = express.Router();
const db = require("../config/connectDB");
const AppController = require("../controllers/appController");

router.get("/", (req, res) => {
  res.send("Hello World from BE!");
});

router.post("/login", AppController.login);
router.get("/users", AppController.getAllUsers);
router.get("/data", AppController.getAllData);
router.get("/data-by-date", AppController.getDataByDate);
router.get("/gardens", AppController.getAllGardens);
router.get("/gardens-by-user-id", AppController.getGardenByUserId);

module.exports = router;
