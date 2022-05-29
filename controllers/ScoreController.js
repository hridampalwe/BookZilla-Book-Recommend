const mongoose = require("mongoose");
const score_model = require("./../models/ScoreModel");
const BookModel = require("./../models/BookModel");
const tfidf = require("natural");
const { TfIdf } = require("natural");
const Vector = require("vector-object");

//Get Data function to covnert the object genres field to array of obects which need to be trained
//For example genres "['Fiction' , 'Science' , 'Horror']" to a array that can be converted to Vector like [{id : vectorObj} , {id2 : vectorObj2}]

const getdata = async () => {
  const t = await BookModel.bookModel.find();
  let arr = [];
  t.forEach((element) => {
    let tempobj = {};

    //Splitting the array into content : "fiction science horror"

    var services = element.genres;
    services = services.split(",");
    services[0] = services[0].substring(1);
    services[services.length - 1] = services[services.length - 1].substring(
      0,
      services[services.length - 1].length - 1
    );
    services.forEach((x, i) => {
      services[i] = services[i].includes("'")
        ? services[i].replaceAll("'", "").trim()
        : services[i].toLowerCase();
    });
    //Creating array of objects with ISBN as the ID for the Books

    tempobj = { id: element.isbn, content: services.join(" ") };
    if (tempobj.id) arr.push(tempobj);
  });

  return arr;
};

//Creating the TF IDF for different words with differenct document to prepare data for the cosinesimilarity function

const createVectorsFromDocs = (processedDocs) => {
  const tfidf = new TfIdf();

  //adding documents for processing all documents and calculate tfidf vectors
  processedDocs.forEach((processedDocument) => {
    tfidf.addDocument(processedDocument.content);
  });

  const documentVectors = [];

  for (let i = 0; i < processedDocs.length; i += 1) {
    const processedDocument = processedDocs[i];
    const obj = {};

    const items = tfidf.listTerms(i);

    for (let j = 0; j < items.length; j += 1) {
      const item = items[j];
      obj[item.term] = item.tfidf;
    }

    const documentVector = {
      id: processedDocument.id,
      vector: new Vector(obj),
    };
    //Creating the object array with ISBN as ID and vector
    documentVectors.push(documentVector);
  }
  return documentVectors;
};

//Calculating the Cosine Similarity for the vector array calculated from above.

const calcSimilarities = (docVectors) => {
  // number of results that you want to return.
  const MAX_SIMILAR = 15;
  // min cosine similarity rating that should be returned.
  const MIN_SCORE = 0.6;
  const data = {};
  for (let i = 0; i < docVectors.length; i += 1) {
    const documentVector = docVectors[i];
    const { id } = documentVector;
    data[id] = [];
  }

  //console.log(docVectors.length);
  for (let i = 0; i < docVectors.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (j % 1000 == 0) console.log(`${i} Pass`);
      const idi = docVectors[i].id;
      const vi = docVectors[i].vector;
      const idj = docVectors[j].id;
      const vj = docVectors[j].vector;
      const similarity = vi.getCosineSimilarity(vj);
      if (similarity > MIN_SCORE) {
        data[idi].push({ id: idj, rating: similarity });
        data[idj].push({ id: idi, rating: similarity });
      }
    }
  }

  // finally sort the similar documents by descending order
  Object.keys(data).forEach(async (id) => {
    data[id].sort((a, b) => b.rating - a.rating);

    if (data[id].length > MAX_SIMILAR) {
      data[id] = data[id].slice(0, MAX_SIMILAR);
      const test = new score_model({
        isbn: id,
        rating: data[id],
      });
      await test.save();
    }
  });
  return data;
};

const getSimilarDocuments = (id, trainedData) => {
  let similarDocuments = trainedData[id];

  if (similarDocuments === undefined) {
    return [];
  }

  return similarDocuments;
};

//Calling all the necessary functions from in fashion and exporting if needed to be trained
exports.trainData = async () => {
  try {
    const po = await getdata();
    console.log(po);
    const store = createVectorsFromDocs(po);
    const op = calcSimilarities(store);
    console.log("finish");
  } catch (err) {
    console.log(err);
  }
};
