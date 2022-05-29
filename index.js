const dotenv = require("dotenv");
const req = require("express/lib/request");
const mongoose = require("mongoose");
const app = require("./app");
const TrainData = require("./controllers/ScoreController");
dotenv.config({ path: "./config.env" });

//Connecting the Database with environment variable DB
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

//Checking if the data is needed to be trained for cosine similarity.

if (process.env.TRAINDATA === "true") {
  TrainData.trainData;
}
else
{
	console.log("Data Trained");
}

// Starting the Server
app.listen(process.env.PORT || 3000, (err) => {
  if (err) console.log(err);
  else console.log(`Server is running ${process.env.PORT}`);
});
