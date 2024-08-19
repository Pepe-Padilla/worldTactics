const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const characterSchema = new Schema({
  name: String,
  description: String,
  hp: { type: Number, default: 100, require: true },
  mp: { type: Number, default: 0, require: true },
  agi: { type: Number, default: 100, require: true },
  vel: { type: Number, default: 70, require: true },
  str: { type: Number, default: 100, require: true },
  def: { type: Number, default: 0, require: true },
  atkrange: { type: Number, default: 1, require: true },
  bonus: [{
    characterId: ObjectId, 
    atribute: [{
      atriName: { type: String, enum: [ "str", "def" ] },
      bonus: Number
    }]
  }],
  skills: [{ 
    name: String,
    description: String,
    range: Number,
    area: Number,
    mp: Number,
    lineEfect: { type: Boolean, default: false },
    pasive: { type: Boolean, default: false },
    afects: { type: String, enum: [ "allies", "enemies", "bouth", "alliesNoSelf", "bouthNoSelf", "terrainAllies", "terrainEnemies", "terrainBouth" ] },
    harmfull: { type: Boolean, default: true },
    efect: [{
      turn: Number,
      atribute: { type: String, enum: [ "hp", "mp", "agi", "vel", "str", "def" ] },
      bonus: Number,
      sprites: Schema.Types.ObjectId,
      special: String
    }]
  }],
  sprites: Schema.Types.ObjectId,
  status: [{ 
    name: String,
    description: String,
    icon: Schema.Types.ObjectId,
    efect: [{
      turn: Number,
      atribute: { type: String, enum: [ "hp", "mp", "vel", "str", "def" ] },
      bonus: Number,
      sprites: Schema.Types.ObjectId,
      special: String
    }]
  }],
});

const CharacterModel = mongoose.model('Character', characterSchema);

module.exports = CharacterModel;