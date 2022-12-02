const db = require("../config/connectDB");

const getUsers = (req, res) => {
  const q = "SELECT * FROM `user`";
  db.query(q, (err, data) => {
    if (err) throw err;
    res.status(200).json(data);
  });
};

const login = (req, res) => {
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
      res
        .status(200)
        .json({ user: data, message: "Login successfully", success: true });
    }
  });
};

const getData = (req, res) => {
  const q = "SELECT * FROM `data`";
  db.query(q, (err, data) => {
    if (err) throw err;
    res.status(200).json(data);
  });
};

module.exports = {
  login,
  getUsers,
  getData,
};
