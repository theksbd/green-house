const db = require("../config/connectDB");
const jwt = require("jsonwebtoken");

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
    const q = "SELECT * FROM garden JOIN pump_threshold ON pump_threshold.garden_id = garden.id";
    db.query(q, (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
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
}

module.exports = new AppController();
