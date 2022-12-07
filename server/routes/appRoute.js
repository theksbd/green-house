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
router.get("/gardens", AppController.getAllGardens);
router.get("/gardens/:user_id", AppController.getGardenByUserId);
router.get("/data/:garden_id/:date", AppController.getDataByDate);
router.put("/pump-threshold/:garden_id", AppController.updatePumpThreshold);

module.exports = router;
