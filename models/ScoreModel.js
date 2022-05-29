const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  isbn: {
    type: Number,
  },
  rating: {
    type: Array,
  },
});
const ScoreModel = mongoose.model("recommends", ScoreSchema, "recommends");

module.exports = ScoreModel;
