const db = require("../config/connectDB");
const axios = require("axios");
class AppController {
  constructor() {
    this.login = this.login.bind(this);
    this.getDataByDate = this.getDataByDate.bind(this);
    this.updatePumpThreshold = this.updatePumpThreshold.bind(this);
    this.calculateDateDifference = this.calculateDateDifference.bind(this);
    this.getPhaseStatus = this.getPhaseStatus.bind(this);
    this.getGarden = this.getGarden.bind(this);
    this.getChartByDate = this.getChartByDate.bind(this);
    this.getDataByDate = this.getDataByDate.bind(this);
    this.getAllTrees = this.getAllTrees.bind(this);
    this.initializeGarden = this.initializeGarden.bind(this);
  }

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

  getDataByDate(req, res) {
    const { garden_id, date } = req.params;
    const q =
      "SELECT * FROM data WHERE data.date = ? AND data.garden_id = ? ORDER BY data.time";
    db.query(q, [date, garden_id], (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  getChartByDate(req, res) {
    const { garden_id, date } = req.params;
    const q =
      "SELECT * FROM data WHERE data.date = ? AND data.garden_id = ? ORDER BY time";
    db.query(q, [date, garden_id], async (err, result) => {
      if (err) res.status(500).json(err);
      var temperature = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      var moisture = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      var humidity = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      result.forEach((item) => {
        var time = parseInt(item.time[0] + item.time[1]);
        temperature[time] = item.temperature;
        moisture[time] = item.soil_moisture;
        humidity[time] = item.humidity;
      });
      res.status(200).json({
        temperature: temperature,
        moisture: moisture,
        humidity: humidity,
      });
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

  async getPhaseStatus(req, res) {
    const { garden_id } = req.params;
    const { success, message, garden } = await this.calculateDateDifference(
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
      const phase =
        phaseIndex === -1
          ? {
              id: -1,
              period: -1,
              name: "No phase",
            }
          : result[phaseIndex];
      return res.status(200).json({ phase, differentInDay });
    });
  }

  getGarden(req, res) {
    const { garden_id } = req.params;
    const q = `
      SELECT
        garden.*,
        garden.name AS garden_name,
        pump_threshold.low_threshold,
        pump_threshold.high_threshold,
        tree.name,
        tree.img_url
      FROM
        garden
      JOIN
        pump_threshold
      ON
        pump_threshold.garden_id = garden.id
      JOIN
        tree
      ON
        tree.id = garden.tree_id
      WHERE
        garden.id = ?
      `;
    db.query(q, [garden_id], async (err, result) => {
      if (err) return res.status(500).json(err);
      let garden = result[0];
      const phaseInfo = await axios.get(
        `http://localhost:5000/api/phase-status/${garden_id}`
      );
      garden = { ...garden, ...phaseInfo.data };
      return res.status(200).json({ ...garden });
    });
  }

  getAllTrees(req, res) {
    const q = `SELECT * FROM tree ORDER BY id ASC`;
    db.query(q, (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(result);
    });
  }

  initializeGarden(req, res) {
    const { garden_id } = req.params;
    const { tree_id, start_date, description, garden_name } = req.body;
    const q = `UPDATE garden SET tree_id = ?, start_date = ?, description = ?, name = ? WHERE id = ?`;
    const values = [tree_id, start_date, description, garden_name, garden_id];
    console.log();
    db.query(q, values, async (err, result) => {
      if (err) return res.status(500).json(err);
      const phaseInfo = await axios.get(
        `http://localhost:5000/api/phase-status/${garden_id}`
      );
      const { high_threshold, low_threshold } = phaseInfo.data.phase;
      const response = await axios.put(
        `http://localhost:5000/api/pump-threshold/${garden_id}`,
        {
          high_threshold,
          low_threshold,
        }
      );
      return res.status(200).json({ message: "Initialize successfully" });
    });
  }
}

module.exports = new AppController();
