const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Character = require('./models/character');
const Map = require('./models/map');
const Game = require('./models/game');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/maps/1', async(req, res) => {
  const kira = require('./maps/customMap1.json');
  console.log(kira);
  res.status(200).json(kira);
}); 
app.get('/maps/2', async(req, res) => {
  const kira = require('./maps/customMap2.json');
  console.log(kira);
  res.status(200).json(kira);
}); 
app.get('/maps/3', async(req, res) => {
  const kira = require('./maps/customMap3.json');
  console.log(kira);
  res.status(200).json(kira);
}); 
app.get('/maps/4', async(req, res) => {
  const kira = require('./maps/customMap4.json');
  console.log(kira);
  res.status(200).json(kira);
}); 

app.get('/kira', async(req, res) => {
  const kira = require('./chars/kira.json');
  console.log(kira);
  res.status(200).json(kira);
}); 

app.get('/maps', async (req, res) => {
  console.log('TRYING TO FETCH MAPS');
  try {
    const maps = await Map.find();
    res.status(200).json({
      maps: maps.map((maps) => ({
        id: maps.id,
        name: maps.name,
      })),
    });
    console.log('FETCHED MAPS');
  } catch (err) {
    console.error('ERROR FETCHING MAPS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load maps.' });
  }
});

// Game
app.post('/games', async (req, res) => {
  console.log('TRYING TO STORE A GAME');
  const gameText = req.body;
  console.log(gameText);

  if (!gameText) {
    console.log('INVALID INPUT - NO TEXT');
    return res.status(422).json({ message: 'Invalid game' });
  }

  const game = new Game(gameText);

  if(!game._id) {
    try {
      await game.save();
      res
        .status(201)
        .json({ message: 'Game saved', game: { _id: game._id } });
      console.log('GAME SAVED');
    } catch (err) {
      console.error('ERROR GAME SAVED');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to save the GAME.' });
    }
  } else {
    const filter = { _id: game._id }
    try {
      await Game.findOneAndUpdate(filter,game);
      res
        .status(201)
        .json({ message: 'Game updated', game: { _id: game._id } });
      console.log('GAME SAVED');
    } catch (err) {
      console.error('ERROR GAME SAVED');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to save the GAME.' });
    }
  }
});

app.get('/games/:id', async (req, res) => {
  console.log('TRYING TO FETCH GAME');
  try {
    const game = await Game.findById(req.params.id );
    res.status(200).json(game);
    console.log('FETCHED GAME');
  } catch (err) {
    console.error('ERROR FETCHING GAME');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to get GAME' });
  }
});

var usr = process.env.MONGODB_USERNAME;
var pwd = process.env.MONGODB_PASSWORD;
mongoose.connect(
  `mongodb://${usr}:${pwd}@mongodb:27017/course-goals?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB');
      app.listen(80);
    }
  }
);
