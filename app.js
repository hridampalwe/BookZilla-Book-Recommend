const express = require("express");
const mongoose = require("mongoose");
const tfidf = require("natural");
const { TfIdf } = require("natural");
const Vector = require("vector-object");

//Initializing the variable with express
const app = express();

//Connnecting the bookRouter on the '/'  on the app
const booksRouter = require("./routers/booksRouter");
app.use("/", booksRouter);

//Adding the Middlewares for our app
app.use(express.json());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//Serving the static files for Client Side
app.use(express.static(`${__dirname}/public`, { index: "overview.html" }));

module.exports = app;
