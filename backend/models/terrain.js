const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const terrainSchema = new Schema({
    sprite: String,
    minAgi: Number,
    steep: Number,
    defBonus: Number,
    resource: Number 
});

const theModel = mongoose.model('Terrain', terrainSchema);

module.exports = theModel;