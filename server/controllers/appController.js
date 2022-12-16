const db = require("../config/connectDB");
const axios = require("axios");
class AppController {
  login(req, res) {
    const { username, password } = req.body;
    const q = `SELECT * FROM user WHERE username = ? AND password = ? LIMIT 1`;
    const values = [username, password];
    db.query(q, values, (err, result) => {
      if (err) res.status(500).json(err);
      if (result.length === 0) {
        res
          .status(404)
          .json({ user: result, message: "User not found", success: false });
      } else {
        const { password, ...user } = result[0];
        user.garden_id = user.id;
        res.status(200).json({
          user,
          message: "Login successfully",
          success: true,
        });
      }
    });
  }

  getAllUsers(req, res) {
    const q = "SELECT * FROM user";
    db.query(q, (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  getAllData(req, res) {
    const q =
      "SELECT data.*, pump_threshold.high_threshold, pump_threshold.low_threshold FROM data JOIN pump_threshold ON data.garden_id = pump_threshold.garden_id";
    db.query(q, (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  getAllGardens(req, res) {
    const q =
      "SELECT * FROM garden JOIN pump_threshold ON pump_threshold.garden_id = garden.id";
    db.query(q, (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  getDataByGardenId(req, res) {
    const q =
      "SELECT data.*, pump_threshold.high_threshold, pump_threshold.low_threshold FROM data JOIN pump_threshold ON data.garden_id = pump_threshold.garden_id WHERE data.garden_id = ?";
    db.query(q, [req.params.garden_id], (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  getDataByDate(req, res) {
    const { garden_id, date } = req.params;
    const q = "SELECT * FROM data WHERE data.date = ? AND data.garden_id = ?";
    db.query(q, [date, garden_id], (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  updatePumpThreshold(req, res) {
    const { garden_id } = req.params;
    const { high_threshold, low_threshold } = req.body;
    const q = `UPDATE pump_threshold SET high_threshold = ?, low_threshold = ? WHERE garden_id = ?`;
    const values = [high_threshold, low_threshold, garden_id];
    db.query(q, values, (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  insertData(req, res) {
    var { garden_id } = req.params;
    var query = "SELECT * FROM garden WHERE id = ? LIMIT 1";
    db.query(query, [garden_id], async (error, result) => {
      if (error) res.status(500).json(error);
      var params = {
        params: {
          "X-AIO-Key": result[0].AIO_Key,
        },
      };
      var AIO_Link =
        "https://io.adafruit.com/api/v2/" + result[0].AIO_Username + "/feeds/";
      var pump = await axios
        .get(AIO_Link + "pump/data/last", params)
        .then((response) => response.data)
        .then((data) => data.value);
      var temperature = await axios
        .get(AIO_Link + "temperature/data/last", params)
        .then((response) => response.data)
        .then((data) => data.value);
      var moisture = await axios
        .get(AIO_Link + "moisture/data/last", params)
        .then((response) => response.data)
        .then((data) => data.value);
      var humid = await axios
        .get(AIO_Link + "humid/data/last", params)
        .then((response) => response.data)
        .then((data) => data.value);
      var door = await axios
        .get(AIO_Link + "door/data/last", params)
        .then((response) => response.data)
        .then((data) => data.value);

      var date = new Date();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();
      var dateString =
        date.getFullYear() +
        "-" +
        (mm > 9 ? "" : "0") +
        mm +
        "-" +
        (dd > 9 ? "" : "0") +
        dd;

      let hh = date.getHours();
      let mi = date.getMinutes();
      let se = date.getSeconds();
      var timeString =
        (hh > 9 ? "" : "0") +
        hh +
        ":" +
        (mi > 9 ? "" : "0") +
        mi +
        ":" +
        (se > 9 ? "" : "0") +
        se;

      var query =
        "INSERT INTO data (garden_id, time, date, temperature, humidity, soil_moisture, pump_status, door_status) VALUES (?,?,?,?,?,?,?,?)";
      db.query(
        query,
        [
          garden_id,
          timeString,
          dateString,
          temperature,
          humid,
          moisture,
          pump,
          door,
        ],
        (err, r) => {
          if (err) res.status(500).json(err);
          res.status(200).json(r);
        }
      );
    });
  }

  calculateDateDifference(garden_id) {
    return new Promise((resolve, reject) => {
      const q = "SELECT * FROM garden WHERE id = ?";
      db.query(q, [garden_id], (err, result) => {
        if (err) reject({ message: err, success: false });
        const today = new Date();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        const dateString =
          today.getFullYear() +
          "-" +
          (mm > 9 ? "" : "0") +
          mm +
          "-" +
          (dd > 9 ? "" : "0") +
          dd;
        const garden = result[0];
        const startDateOfGarden = new Date(garden.start_date);
        const now = new Date(dateString);
        const differentInTime = now.getTime() - startDateOfGarden.getTime();
        const differentInDay = Math.floor(differentInTime / (24 * 3600 * 1000));
        resolve({ message: differentInDay, garden, success: true });
      });
    });
  }

  async updatePumpThresholdAtTheBeginningOfPeriod(req, res) {
    const { garden_id } = req.params;
    const app = new AppController();
    const { success, message, garden } = await app.calculateDateDifference(
      garden_id
    );
    if (!success) return res.status(500).json(message);
    const differentInDay = message;
    const q = `SELECT * FROM phase WHERE tree_id = ? ORDER BY period ASC`;
    const values = [garden.tree_id];
    db.query(q, values, (err, result) => {
      if (err) return res.status(500).json(err);
      // Check if differentInDay is the first day of the new period
      let oldPhaseIndex;
      if (differentInDay === 0 || differentInDay === 1) {
        oldPhaseIndex = -1; // then phase will be the first phase due to the oldPhaseIndex + 1
      } else {
        oldPhaseIndex = result.findIndex(
          (item) => differentInDay - item.period === 1
        );
        if (oldPhaseIndex === -1)
          return res.status(200).json({ message: "Still in the same phase" });
      }
      const phase = result[oldPhaseIndex + 1];
      if (!phase)
        return res.status(200).json({ message: "No any further phases" });
      const { high_threshold, low_threshold } = phase;
      const q = `UPDATE pump_threshold SET high_threshold = ?, low_threshold = ? WHERE garden_id = ?`;
      const values = [high_threshold, low_threshold, garden_id];
      db.query(q, values, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result);
      });
    });
  }

  async getPhaseStatus(req, res) {
    const { garden_id } = req.params;
    const app = new AppController();
    const { success, message, garden } = await app.calculateDateDifference(
      garden_id
    );
    if (!success) return res.status(500).json(message);
    const differentInDay = message;
    const q = `SELECT * FROM phase WHERE tree_id = ? ORDER BY period ASC`;
    const values = [garden.tree_id];
    db.query(q, values, (err, result) => {
      if (err) return res.status(500).json(err);
      const phaseIndex = result.findIndex(
        (item) => differentInDay <= item.period
      );
      if (phaseIndex === -1)
        return res.status(200).json({ message: "No phase" });
      const phase = result[phaseIndex];
      return res.status(200).json(phase);
    });
  }

  getGardenByUserId(req, res) {
    const { user_id } = req.params;
    const q =
      "SELECT * FROM garden JOIN pump_threshold ON pump_threshold.garden_id = garden.id WHERE manager_id = ?";
    db.query(q, [user_id], (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }
}

module.exports = new AppController();
