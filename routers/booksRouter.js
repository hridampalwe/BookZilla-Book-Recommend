const express = require("express");
const BookController = require("./../controllers/BookController");
const ScoreController = require("./../controllers/ScoreController");

//Initializing the Router for app
const router = express.Router();

//Creating routes for different URL and functions and mapping them to desired functions.
router.route("/getRecommendation").get(BookController.getRecommendation);
router.route("/getBook").get(BookController.getBook);
router.route("/getAllBooks").get(BookController.getAllBooks);

module.exports = router;
