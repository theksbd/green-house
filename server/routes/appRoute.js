const express = require("express");
const router = express.Router();
const db = require("../config/connectDB");
const AppController = require("../controllers/appController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", (req, res) => {
  res.send("Hello World from BE!");
});

router.post("/login", AppController.login);
router.get("/users", AppController.getAllUsers);
router.get("/data", AppController.getAllData);
router.get("/gardens", AppController.getAllGardens);
router.get(
  "/gardens-by-user-id",
  authMiddleware,
  AppController.getGardenByUserId
);
router.get("/data/:garden_id", authMiddleware, AppController.getDataByGardenId);

module.exports = router;
