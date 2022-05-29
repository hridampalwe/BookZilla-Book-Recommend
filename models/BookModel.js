const mongoose = require("mongoose");

//Declaring Schema for the database of the book
const UserSchema = new mongoose.Schema({
  title: String,
  series: String,
  author: String,
  characters: String,
  description: String,
  language: String,
  gernes: String,
  bookFormat: String,
  edition: String,
  publisher: String,
  rating: Number,
  isbn: Number,
  pages: Number,
  numRatings: Number,
  likedPercent: Number,
});

//Create the index for enabling the text search
UserSchema.index({ title: "text" });

//Creating the model from the schema and opening
const books = mongoose.model("books", UserSchema);

module.exports = { bookModel: books };
