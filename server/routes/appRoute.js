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
router.get("/gardens/:garden_id", AppController.getGarden);
router.get("/data/:garden_id/:date", AppController.getDataByDate);
router.get("/chart/:garden_id/:date", AppController.getChartByDate);
router.put("/pump-threshold/:garden_id", AppController.updatePumpThreshold);
router.post("/insert-data/:garden_id", AppController.insertData);
router.get("/phase-status/:garden_id", AppController.getPhaseStatus);

module.exports = router;
