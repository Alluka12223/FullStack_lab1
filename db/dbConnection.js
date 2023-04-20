const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();
const uri = process.env.URI;


dbConnect().catch((err) => console.log(err));

async function dbConnect() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Music" });
  const con = mongoose.connection;
  con.on("open", () => {
    console.log("Database connected successfully!");
  });
}

module.exports = { dbConnect };