const mongoose = require("mongoose");

const microbitSchema = new mongoose.Schema({
  microbit_name: {
    type: String,
    required: true,
  },
  huminity_lower: {
    type: Number,
    required: true,
  },
  huminity_higher: {
    type: Number,
    required: true,
  },
  ada_username: {
    type: String,
    require: true,
  },
  AIO_key: {
    type: String,
    require: true,
  },
});

const microbitModel = mongoose.model("microbit", microbitSchema);

module.exports = microbitModel;
