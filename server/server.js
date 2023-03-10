const express = require("express");
const cors = require("cors");
const db = require("./config/connectDB");
const appRoutes = require("./routes/appRoute");
const mqtt = require("./mqtt/MQTTClient");
const schedule = require("./controllers/appSchedule");


mqtt.on("message", (topic, message) => {
  const split = topic.split("/");
  const moistureFeed = split[2];
  if (moistureFeed == "moisture") {
    const data = parseInt(message.toString());
    var garden_id = 1;
    const q = "SELECT * FROM pump_threshold WHERE id = " + garden_id;
    db.query(q, async (err, result) => {
      let high = result[0].high_threshold;
      let low = result[0].low_threshold;
      if (data < low) {
        const pumpFeed = [split[0], split[1], "pump"].join("/");
        mqtt.publish(pumpFeed, "1");
      }
      else if (data > high) {
        const pumpFeed = [split[0], split[1], "pump"].join("/");
        mqtt.publish(pumpFeed, "0");
      }
    });
  }
});

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", appRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
