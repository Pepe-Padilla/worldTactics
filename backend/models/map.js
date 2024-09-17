const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    "name": {
      "type": "String"
    },
    "description": {
      "type": "String"
    },
    "author": {
      "type": "String"
    },
    "public": {
      "type": "Boolean"
    },
    "craeateDate": {
      "type": "Date"
    },
    "lastModifiedDate": {
      "type": "Date"
    },
    "rate": {
      "type": "Number"
    },
    "xSize": {
      "type": "Number"
    },
    "ySize": {
      "type": "Number"
    },
    "arrayTerrain": {
      "type": [
        "Mixed"
      ]
    }
  }
);

const model = mongoose.model('Map', modelSchema);

module.exports = model;