# BookZilla-Book-Recommend #
## Simple content-based recommendation engine made with MongoDB, Express JS and NodeJS ##

This engine uses a [Consine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity) and [Eucledean Distance](https://en.wikipedia.org/wiki/Euclidean_distance) to recommend a book to a selected book by the user 

Its a filtering system that uses above algorithms to filter through large datasets

Recommendations done using content-based recommenders can be seen as a user-specific classification problem. This classifier learns the user's likes and dislikes from the features of the song. The most straightforward approach is keyword matching. In a few words, the idea behind is to extract meaningful keywords present in a song description a user likes, search for the keywords in other song descriptions to estimate similarities among them, and based on that, recommend those songs to the user.

In our case, because we are working with text and words, Term Frequency-Inverse Document Frequency (TF-IDF) can be used for this matching process.


The mongodb path containing the dataset must contain title and genre for cosine similarity. 

Dataset used in the example [Kaggle goodreads](https://www.kaggle.com/datasets/meetnaren/goodreads-best-books) 


## To run the server ##
* After cloning, run npm install to download and install all the required dependencies.
* Run node index.js to start the server at localhost:3000/
