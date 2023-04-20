const express = require("express")
const Album = require("../models/AlbumSchema.js");
const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const album = await Album.find()
    res.json(album)
  } catch (err) {
    res.status(500).send(err.message);
  }
})

router.post('/', async (req, res) => {
  try {
    const newAlbum = {
      title: req.body.title,
      artist: req.body.artist,
      year: req.body.year
    }
    const albums = await Album.find(newAlbum).exec();
    if (albums.length > 0) {
      res.status(409).json({ message: "This album is registered into the database!" })
      return;
    }

    let newId = await generateID()

    const album = new Album({
      id:newId,
      ...newAlbum,
    });

    try {
      const a1 = await album.save();
      console.log(a1);
      res.status(201).json([a1]);
    } catch (err) {
      res.sendStatus(400);
      return;
    }
  } catch (error) {
    console.log('err', error);
  }
})

router.get("/:title", async (req, res) => {
  const searchTitle = req.params.title;
  try {
    const album = await Album.find({ title: { $regex: new RegExp(`${searchTitle}`, "i") } }).exec();
    if (album.length === 0) {
      res.status(404).send(`No such album with title ${searchTitle} in the database!`);
      return;
    }
    res.json(album);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



module.exports = router;