const schedule = require("node-schedule");
const axios = require("axios");
const db = require("../config/connectDB");
const AppController = require("../controllers/appController");

class AppSchedule {
  constructor() {
    schedule.scheduleJob("1 0 * * * *", this.updateData);
    schedule.scheduleJob(
      "1 0 0 * * *",
      this.updatePumpThresholdAtTheBeginningOfPeriod
    );
  }

  updateData = async () => {
    var lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);
    lastHour.setMinutes(0, 0, 0);
    var moisture = await this.getData(lastHour, "moisture");
    var temperature = await this.getData(lastHour, "temperature");
    var humid = await this.getData(lastHour, "humid");
    console.log(lastHour.toTimeString());
    console.log(lastHour.toLocaleDateString());

    var query =
      "INSERT INTO data (garden_id,time,date,temperature,humidity,soil_moisture) VALUES (1,?,?,?,?,?)";
    db.query(
      query,
      [lastHour, lastHour, temperature, humid, moisture],
      (err, rel) => {
        if (err) throw err;
        console.log("Add data of " + lastHour.toLocaleString());
      }
    );
  };

  async getData(lastHour, feed) {
    var end_time = new Date(lastHour.setMinutes(59, 59, 999));
    var start_time = new Date(lastHour.setMinutes(0, 0, 0));
    const response = await axios.get(
      "https://io.adafruit.com/api/v2/nhom3cnpm/feeds/" + feed + "/data",
      {
        params: {
          start_time: start_time.toISOString(),
          end_time: end_time.toISOString(),
        },
      }
    );
    var data = await response.data;
    var length = data.length;
    var average = 0;
    if (length > 0) {
      average = (
        data.reduce((a, b) => a + parseInt(b.value), 0) / length
      ).toFixed(2);
    }
    return average;
  }

  updatePumpThresholdAtTheBeginningOfPeriod = async () => {
    const { success, message, garden } =
      await AppController.calculateDateDifference(1);
    if (!success) return res.status(500).json(message);
    const differentInDay = message;
    const q = `SELECT * FROM phase WHERE tree_id = ? ORDER BY period ASC`;
    const values = [garden.tree_id];
    db.query(q, values, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      // Check if differentInDay is the first day of the new period
      let oldPhaseIndex;
      if (differentInDay === 0 || differentInDay === 1) {
        oldPhaseIndex = -1; // then phase will be the first phase due to the oldPhaseIndex + 1
      } else {
        oldPhaseIndex = result.findIndex(
          (item) => differentInDay - item.period === 1
        );
        if (oldPhaseIndex === -1) {
          console.log(
            `Still in the same phase, current day: ${differentInDay}`
          );
          return;
        }
      }
      const phase = result[oldPhaseIndex + 1];
      if (!phase) {
        console.log(`No any further phases, current day: ${differentInDay}`);
        return;
      }
      const { high_threshold, low_threshold } = phase;
      const q = `UPDATE pump_threshold SET high_threshold = ?, low_threshold = ? WHERE garden_id = ?`;
      const values = [high_threshold, low_threshold, 1];
      db.query(q, values, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(
          `Update pump threshold successfully, current day: ${differentInDay}`
        );
      });
    });
  };
}

module.exports = new AppSchedule();
