const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connection = require("./config/connectDB");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

const userRoute = require("./routes/user.route");
const microRoute = require("./routes/micro.route");
const infoRoute = require("./routes/info.route");

app.use("/api/user", userRoute);
app.use("/api/microbit", microRoute);
app.use("/api/info", infoRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
