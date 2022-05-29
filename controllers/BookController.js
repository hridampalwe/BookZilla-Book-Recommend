const book_data = require("./../models/BookModel");
const score_data = require("./../models/ScoreModel");
const mongoose = require("mongoose");
const fuzzy = require("./../utils/fuzzy");

//Search the boook from particular query from search bar
exports.getBook = async (req, res) => {
  const books_found = await fuzzy.search(req.query.keyword);
  // console.log(books_found);
  res.json({
    books: books_found,
  });
};

//Get all the books in paginated form.
exports.getAllBooks = async (req, res) => {
  const limit = 5;
  let req_skip = limit * parseInt(req.query.page || 1);
  const booksListdata = await book_data.bookModel
    .find()
    .limit(40)
    .skip(req_skip)
    .sort("_id");
  res.json({
    booksListdata,
  });
};

//Gettting recommendation for the book clicked and by specified rating Euclidian and Cosine Similarity

exports.getRecommendation = async (req, res) => {
  const limitofbooks = 12;
  const matched_results = await score_data.find({
    isbn: req.query.isbn * 1,
  });
  let arr = [];
  if (matched_results.length != 0) {
    matched_results[0].rating.forEach((obj) => {
      arr.push(obj.id * 1);
    });
  }

  const recommendCos = await book_data.bookModel.aggregate([
    {
      $match: {
        isbn: {
          $in: arr,
        },
      },
    },
    {
      $limit: 8,
    },
  ]); // Okaye

  let diff = limitofbooks - recommendCos.length;
  let recommendadtion = await book_data.bookModel.aggregate([
    {
      $match: {
        _id: { $ne: req.query._id },
      },
    },
    {
      $project: {
        isbn: 1,
        title: 1,
        rating: 1,
        numRatings: 1,
        genres: 1,
        series: 1,
        author: 1,
        description: 1,
        language: 1,
        characters: 1,
        book_format: 1,
        edition: 1,
        pages: 1,
        publisher: 1,
        publishDate: 1,
        awards: 1,
        ratingByStars: 1,
        likedPercent: 1,
        setting: 1,
        coverImg: 1,
        price: 1,
        genres: 1,
        distance: {
          //Calculating the Euclidian distance for the recommendation
          $sqrt: {
            $add: [
              {
                $pow: [{ $subtract: [Number(req.rating), "$rating"] }, 2],
              },
              {
                $pow: [
                  { $subtract: [Number(req.numRatings), "$numRatings"] },
                  2,
                ],
              },
            ],
          },
        },
      },
    },
    {
      $match: {
        distance: { $ne: null },
      },
    },
    {
      $sort: { distance: 1 },
    },
    {
      $limit: diff,
    },
  ]);
  recommendadtion = recommendCos.concat(recommendadtion);
  res.json({
    //Sending the Data through JSON format Recommmended
    recommendadtion,
  });
};
