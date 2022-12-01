const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
  door_status: {
    type: Boolean,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    require: true,
  },
});

const infoModel = mongoose.model("information", infoSchema);

module.exports = infoModel;
