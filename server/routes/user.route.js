const express = require("express");
const router = express.Router();
const Info = require("../models/info.model");

router.get("/get-temperature", async (req, res) => {
  try {
    const temperature = await Info.find({});
    res.status(200).send({
      message: "Fetch temperature successfully",
      success: true,
      data: temperature,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching temperature",
      success: false,
      error,
    });
  }
});

module.exports = router;
