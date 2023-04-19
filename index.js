const express = require("express");
// const cors = require("cors");
// const { connectDB } = require("./db/conn.js");
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const AlbumSchema = require("./AlbumSchema")
// const albumRoutes = require("./routes/album.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL;
// const staticPath = "src/static";


// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// app.use(bodyParser.json());
app.use(express.json());

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "Music"
};
mongoose.connect(url, connectionParams)
.then(()=>{console.log('db and mongoose connected');})
.catch((err) => console.log(err));

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`, req.body);
//   next();
// });

// app.use(express.static(staticPath));

// app.use("/api/albums", albumRoutes);

app.listen(port, async () => {
  // await connectDB();
  console.log(`Server is running on port: ${port}. http://localhost:${port}`);
});

app.get('/', async (req, res) => {
  try {
    const album = await AlbumSchema.find()
    res.json(album)
  } catch (error) {
    console.log('err',error);
  }
})

app.post('/', async (req, res) => {
  const newAlbum = new AlbumSchema({
    title: req.body.title,
    artist: req.body.artist,
    year: req.body.year
  })
  try {
    const album = await newAlbum.save()
    res.json(album)
  } catch (error) {
    console.log('err', error);
  }
})
