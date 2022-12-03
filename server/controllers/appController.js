const db = require("../config/connectDB");
const TOKEN = require("../constant");

class AppController {
  login(req, res) {
    const { username, password } = req.body;
    const q = `SELECT * FROM user WHERE username = ? AND password = ? LIMIT 1`;
    const values = [username, password];
    db.query(q, values, (err, data) => {
      if (err) res.status(500).json(err);
      if (data.length === 0) {
        res
          .status(404)
          .json({ user: data, message: "User not found", success: false });
      } else {
        console.log(data[0]);
        res.status(200).json({
          user: data,
          message: "Login successfully",
          success: true,
          token: TOKEN + data[0].id,
        });
      }
    });
  }

  getAllUsers(req, res) {
    const q = "SELECT * FROM user";
    db.query(q, (err, data) => {
      if (err) res.status(500).json(err);
      res.status(200).json(data);
    });
  }

  getData(req, res) {
    const q = "SELECT * FROM data";
    db.query(q, (err, data) => {
      if (err) res.status(500).json(err);
      res.status(200).json(data);
    });
  }

  getAllGardens(req, res) {
    const q = "SELECT * FROM garden";
    db.query(q, (err, data) => {
      if (err) res.status(500).json(err);
      res.status(200).json(data);
    });
  }

  getGardenByUserId(req, res) {
    const { id: userId } = req.body;
    const q = "SELECT * FROM garden WHERE manager_id = ?";
    db.query(q, [userId], (err, data) => {
      if (err) res.status(500).json(err);
      res.status(200).json(data);
    });
  }
}

module.exports = new AppController();
