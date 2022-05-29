const BookModel = require("./../models/BookModel");

const User = BookModel.bookModel;

const search = async function (reqTitle) {
  const search_results = await User.find(
    { $text: { $search: `${reqTitle}` } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(10);
  return search_results;
};

module.exports = { search };
