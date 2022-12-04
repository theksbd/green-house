const db = require("../config/connectDB");
const TOKEN = require("../constant");

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
        res.status(200).json({
          user: result,
          message: "Login successfully",
          success: true,
          token: TOKEN + result[0].id,
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
      "SELECT * FROM data JOIN pump_threshold ON data.garden_id = pump_threshold.garden_id";
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

  getDataByDate(req, res) {
    const { date } = req.body;
    const q =
      "SELECT * FROM data JOIN pump_threshold ON data.garden_id = pump_threshold.garden_id WHERE date = ?";
    db.query(q, [date], (err, result) => {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }
}

module.exports = new AppController();
