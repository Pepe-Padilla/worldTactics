const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mapSchema = new Schema(
  {
    name: String,
    description: String,
    author: String,
    public: Boolean,
    craeateDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
    rate: Number,
    xSize: Number,
    ySize: Number,
    arrayTerrain: [
      {
        rowNumber: Number,
        row: [
          {
            x: Number,
            y: Number,
            terrain: Schema.Types.ObjectId
          },
        ],
      }
    ]
  }
);

const MapModel = mongoose.model('Map', mapSchema);

module.exports = MapModel;