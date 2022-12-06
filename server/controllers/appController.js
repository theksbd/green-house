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
        const user = result[0];
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({
          user,
          token,
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
    const q = "SELECT * FROM garden";
    db.query(q, (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }

  getGardenByUserId(req, res) {
    const { id: userId } = req.body;
    const q = "SELECT * FROM garden WHERE manager_id = ?";
    db.query(q, [userId], (err, result) => {
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
    const { date } = req.body;
    const q =
      "SELECT data.*, pump_threshold.high_threshold, pump_threshold.low_threshold FROM data JOIN pump_threshold ON data.garden_id = pump_threshold.garden_id WHERE data.date = ?";
    db.query(q, [date], (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }
}

module.exports = new AppController();
