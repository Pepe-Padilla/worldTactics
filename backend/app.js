const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Character = require('./models/character');
const MapT = require('./models/map');

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
  const kira = require('./maps/StepOn1v1.json');
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
    const maps = await MapT.find();
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

/*app.post('/goals', async (req, res) => {
  console.log('TRYING TO STORE GOAL');
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    console.log('INVALID INPUT - NO TEXT');
    return res.status(422).json({ message: 'Invalid goal text.' });
  }

  const goal = new Goal({
    text: goalText,
  });

  try {
    await goal.save();
    res
      .status(201)
      .json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
    console.log('STORED NEW GOAL');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save goal.' });
  }
});*/

app.get('/maps/:id', async (req, res) => {
  console.log('TRYING TO DELETE GOAL');
  try {
    const maps = await MapT.findOne({ _id: req.params.id });
    res.status(200).json({
      maps: maps.map(maps),
    });
    console.log('FETCHED MAP');
  } catch (err) {
    console.error('ERROR FETCHING MAPS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete MAPS.' });
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
