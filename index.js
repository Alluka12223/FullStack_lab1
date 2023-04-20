const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./db/dbConnection.js");
const bodyParser = require("body-parser");
const routes = require("./routes/api.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*", }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

app.use("/api/albums", routes);

app.listen(port, async () => {
  await dbConnect();
  console.log(`Server is running on port: ${port}. http://localhost:${port}`);
});