const mongoose = require("mongoose");

const album = new mongoose.Schema({
  id:
  {
    type: Number,
    required: true,
    unique: true
  },
  title:
  {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Album", album);