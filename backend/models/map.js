const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mapSchema = new Schema({
  name: String,
  description: String,
  author: String,
  public: Boolean,
  craeateDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
  rate: Number,
  xSize: Number,
  ySise: Number,
  arrayTerrain: [{
    terrainId: Schema.Types.ObjectId,
    status: [{ 
      name: String,
      description: String,
      icon: Schema.Types.ObjectId,
      efect: [{
        turn: Number,
        atribute: { type: String, enum: [ "hp", "mp", "agi", "vel", "str", "def" ] },
        bonus: Number,
        sprites: Schema.Types.ObjectId,
        special: String
      }]
    }],
  }]
});

const MapModel = mongoose.model('Map', mapSchema);

module.exports = MapModel;