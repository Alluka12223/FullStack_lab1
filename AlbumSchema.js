const mongoose = require("mongoose");

const album = new mongoose.Schema({
  title:
  {
    type: String,
    required: true,
    // collation: { locale: "en", strength: 2 },
  },
  artist: {
    type: String,
    required: true,
    // collation: { locale: "en", strength: 2 },
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Album", album);