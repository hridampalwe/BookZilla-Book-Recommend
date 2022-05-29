![npm](https://img.shields.io/npm/v/@imranbarbhuiya/mongoose-fuzzy-searching?style=for-the-badge)
![npm](https://img.shields.io/npm/dw/@imranbarbhuiya/mongoose-fuzzy-searching?style=for-the-badge)
![MIT](https://img.shields.io/github/license/imranbarbhuiya/mongoose-fuzzy-searching?style=for-the-badge)
![Lint Status](https://img.shields.io/github/workflow/status/imranbarbhuiya/mongoose-fuzzy-searching/Lint/main?label=Lint&logo=eslint&style=for-the-badge)
![Build Status](https://img.shields.io/github/workflow/status/imranbarbhuiya/mongoose-fuzzy-searching/Build/main?label=Build&logo=typescript&style=for-the-badge)
![Test Status](https://img.shields.io/github/workflow/status/imranbarbhuiya/mongoose-fuzzy-searching/Test/main?label=Test&style=for-the-badge&logo=Jest)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/imranbarbhuiya/mongoose-fuzzy-searching?logo=codefactor&style=for-the-badge)
![Codecov](https://img.shields.io/codecov/c/github/imranbarbhuiya/mongoose-fuzzy-searching?logo=codecov&style=for-the-badge&token=A9QPRB16OX)

# Mongoose Fuzzy Searching

## Note

\*Notice: This is a fork of the original [Mongoose Fuzzy Searching](https://github.com/VassilisPallas/mongoose-fuzzy-searching)

As that project is no longer maintained, So I'm going to work on it for my personal use. I'll recommend use the original one. Also if VassilisPallas starts maintaining the original project, I'll use that instead.

mongoose-fuzzy-searching is simple and lightweight plugin that enables fuzzy searching in documents in MongoDB.
This code is based on [this article](https://medium.com/xeneta/fuzzy-search-with-mongodb-and-python-57103928ee5d).

npm: [npm](https://www.npmjs.com/package/@imranbarbhuiya/mongoose-fuzzy-searching)
docs: [docs](https://imranbarbhuiya.github.io/mongoose-fuzzy-searching/)

- [Mongoose Fuzzy Searching](#mongoose-fuzzy-searching)
  - [Note](#note)
  - [Features](#features)
  - [Install](#install)
  - [Getting started](#getting-started)
    - [Initialize plugin](#initialize-plugin)
    - [Example with typescript](#example-with-typescript)
    - [Plugin options](#plugin-options)
      - [Fields](#fields)
        - [String field](#string-field)
        - [Object field](#object-field)
      - [Middlewares](#middlewares)
  - [Query parameters](#query-parameters)
    - [Instance method](#instance-method)
  - [Working with pre-existing data](#working-with-pre-existing-data)
    - [Update all pre-existing documents with ngrams](#update-all-pre-existing-documents-with-ngrams)
    - [Delete old ngrams from all documents](#delete-old-ngrams-from-all-documents)
  - [Testing and code coverage](#testing-and-code-coverage)
    - [All tests](#all-tests)
    - [Available test suites](#available-test-suites)
      - [unit tests](#unit-tests)
      - [Integration tests](#integration-tests)
  - [License](#license)
  - [Credit](#credit)

## Features

- Creates Ngrams for the selected keys in the collection
- [Add **fuzzySearch** method on model](#simple-usage)
- [Work with pre-existing data](#work-with-pre-existing-data)

## Install

Install using [npm](https://npmjs.org)

```bash
npm i @imranbarbhuiya/mongoose-fuzzy-searching
```

or using yarn

```bash
yarn add @imranbarbhuiya/mongoose-fuzzy-searching
```

## Getting started

### Initialize plugin

```javascript
const mongoose = require("mongoose");

return mongoose.connect(URL);
```

In the below example, we have a `User` collection and we want to make fuzzy searching in `firstName` and `lastName`.

```javascript
const { Schema } = require("mongoose");
const mongoose_fuzzy_searching = require("@imranbarbhuiya/mongoose-fuzzy-searching");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "lastName"],
});
const User = mongoose.model("User", UserSchema);
module.exports = { User };
```

```javascript
const user = new User({
  firstName: "Joe",
  lastName: "Doe",
  email: "joe.doe@mail.com",
  age: 30,
});

try {
  await user.save(); // mongodb: { ..., firstName_fuzzy: [String], lastName_fuzzy: [String] }
  const users = await User.fuzzySearch("jo");

  console.log(users);
  // each user object will not contain the fuzzy keys:
  // Eg.
  // {
  //   "firstName": "Joe",
  //   "lastName": "Doe",
  //   "email": "joe.doe@mail.com",
  //   "age": 30,
  //   "confidenceScore": 34.3 ($text meta score)
  // }
} catch (e) {
  console.error(e);
}
```

The results are sorted by the `confidenceScore` key. You can override this option.

```javascript
try {
  const users = await User.fuzzySearch("jo").sort({ age: -1 }).exec();
  console.log(users);
} catch (e) {
  console.error(e);
}
```

### Example with typescript

```ts
import mongoose_fuzzy_searching, {MongoosePluginModel} from "@imranbarbhuiya/mongoose-fuzzy-searching";

export interface IUser extends mongoose.Document{
  firstName: string;
  lastName: string;
}

const UserSchema<IUser> = new Schema({
  firstName: String,
  lastName: String,
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName"],
});

const UserModel = mongoose.model<IUser>("User", UserSchema) as MongoosePluginModel<IUser>
```

### Plugin options

Options can contain `fields` and `middlewares`.

#### Fields

Fields attribute is mandatory and should be either an array of `Strings` or an array of `Objects`.

##### String field

If you want to use the default options for all your fields, you can just pass them as a string.

```javascript
const mongoose_fuzzy_searching = require("@imranbarbhuiya/mongoose-fuzzy-searching");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "lastName"],
});
```

##### Object field

In case you want to override any of the default options for your arguments, you can add them as an object
and override any of the values you wish.
The below table contains the expected keys for this object.

| **key**                 | **type**          | **default** | **description**                                                                                                                                                                                                          |
| ----------------------- | ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name                    | **String**        | null        | Collection key name                                                                                                                                                                                                      |
| minSize                 | **Integer**       | 2           | N-grams min size. [Learn more about N-grams](http://text-analytics101.rxnlp.com/2014/11/what-are-n-grams.html)                                                                                                           |
| weight                  | **Integer**       | 1           | Denotes the significance of the field relative to the other indexed fields in terms of the text search score. [Learn more about index weights](https://docs.mongodb.com/manual/tutorial/control-results-of-text-search/) |
| prefixOnly              | **Boolean**       | false       | Only return ngrams from start of word. (It gives more precise results)                                                                                                                                                   |
| escapeSpecialCharacters | **Boolean**       | true        | Remove special characters from N-grams.                                                                                                                                                                                  |
| keys                    | **Array[String]** | null        | If the type of the collection attribute is `Object` or `[Object]` (see example), you can define which attributes will be used for fuzzy searching                                                                        |

Example:

```javascript
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  content: {
      en: String,
      de: String,
      it: String
  }
  text: [
    {
      title: String,
      description: String,
      language: String,
    },
  ],
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    {
      name: 'firstName',
      minSize: 2,
      weight: 5,
    },
    {
      name: 'lastName',
      minSize: 3,
      prefixOnly: true,
    },
    {
      name: 'email',
      escapeSpecialCharacters: false,
    },
    {
      name: 'content',
      keys: ['en', 'de', 'it'],
    },
    {
      name: 'text',
      keys: ['title', 'language'],
    },
  ],
});
```

#### Middlewares

Middlewares is an optional `Object` that can contain custom `pre` middlewares. This plugin is using these middlewares in order to create or update the fuzzy elements. That means that if you add `pre` middlewares, they will never get called since the plugin overrides them. To avoid that problem you can pass your custom midlewares into the plugin. Your middlewares will be called **first**. The middlewares you can pass are:

- preSave
  - stands for `schema.pre("save", ...)`
- preInsertMany
  - stands for `schema.pre("insertMany", ...)`
- preUpdateOne
  - stands for `schema.pre("updateOne", ...)`
- preFindOneAndUpdate
  - stands for `schema.pre("findOneAndUpdate", ...)`
- preUpdateMany
  - stands for `schema.pre("updateMany", ...)`

If you want to add any of the middlewares above, you can add it directly on the plugin.

```javascript
const mongoose_fuzzy_searching = require("@imranbarbhuiya/mongoose-fuzzy-searching");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName"],
  middlewares: {
    preSave: function () {
      // do something before the object is saved
    },
  },
});
```

Middlewares can also be asynchronous functions:

```javascript
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ['firstName'],
  middlewares: {
    preUpdateOne: async function {
      // do something before the object is updated (asynchronous)
    }
  }
});
```

## Query parameters

The fuzzy search query can be used either as `static` function, or as a `helper`, which let's you to chain multiple queries together. The function name in either case is surprise, surprise, `fuzzySearch`.

### Instance method

Instance method can accept up to three parameters. The first one is the query, which can either be either a `String` or an `Object`. This parameter is **required**.
The second parameter can either be eiter an `Object` that contains any additional queries (e.g. `age: { $gt: 18 }`), or a callback function.
If the second parameter is the queries, then the third parameter is the callback function. If you don't set a callback function, the results will be returned inside a Promise.

The below table contains the expected keys for the first parameter (if is an object)

| **key**    | **type**    | **deafult** | **description**                                                                   |
| ---------- | ----------- | ----------- | --------------------------------------------------------------------------------- |
| query      | **String**  | null        | String to search                                                                  |
| minSize    | **Integer** | 2           | N-grams min size.                                                                 |
| prefixOnly | **Boolean** | false       | Only return ngrams from start of word. (It gives more precise results) the prefix |
| exact      | **Boolean** | false       | Matches on a phrase, as opposed to individual terms                               |

Example:

```javascript
/* With string that returns a Promise */
User.fuzzySearch("jo").then(console.log).catch(console.error);

/* With additional options that returns a Promise */
User.fuzzySearch({ query: "jo", prefixOnly: true, minSize: 4 })
  .then(console.log)
  .catch(console.error);

/* With additional queries that returns a Promise */
User.fuzzySearch("jo", { age: { $gt: 18 } })
  .then(console.log)
  .catch(console.error);

/* With string and a callback */
User.fuzzySearch("jo", (err, doc) => {
  if (err) {
    console.error(err);
  } else {
    console.log(doc);
  }
});

/* With additional queries and callback */
User.fuzzySearch("jo", { age: { $gt: 18 } }, (err, doc) => {
  if (err) {
    console.error(err);
  } else {
    console.log(doc);
  }
});
```

## Working with pre-existing data

The plugin creates indexes for the selected fields. In the below example the new indexes will be `firstName_fuzzy` and `lastName_fuzzy`. Also, each document will have the fields `firstName_fuzzy`[String] and `lastName_fuzzy`[String]. These arrays will contain the anagrams for the selected fields.

```javascript
const mongoose_fuzzy_searching = require("@imranbarbhuiya/mongoose-fuzzy-searching");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
});

UserSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "lastName"],
});
```

In other words, this plugin creates anagrams when you create or update a document. All the pre-existing documents won't contain these fuzzy arrays, so `fuzzySearch` function, will not be able to find them.

### Update all pre-existing documents with ngrams

In order to create anagrams for pre-existing documents, you should update each document. The below example, updates the `firstName` attribute to every document on the collection `User`.

```javascript
const cursor = Model.find().cursor();
cursor.next(function (error, doc) {
  const obj = attrs.reduce((acc, attr) => ({ ...acc, [attr]: doc[attr] }), {});
  return Model.findByIdAndUpdate(doc._id, obj);
});
```

### Delete old ngrams from all documents

In the previous example, we set `firstName` and `lastName` as the fuzzy attributes. If you remove the `firstName` from the fuzzy fields, the `firstName_fuzzy` array will not be removed by the collection. If you want to remove the array on each document you have to unset that value.

```javascript
const cursor = Model.find().cursor();
cursor.next(function (error, doc) {
  const $unset = attrs.reduce(
    (acc, attr) => ({ ...acc, [`${attr}_fuzzy`]: 1 }),
    {}
  );
  return Model.findByIdAndUpdate(
    data._id,
    { $unset },
    { new: true, strict: false }
  );
});
```

## Testing and code coverage

### All tests

We use [jest](https://jestjs.io/) for all of our unit and integration tests.

```bash
npm test
```

_Note: this will run all suites **serially** to avoid mutliple concurrent connection on the db._

This will run the tests using a memory database. If you wish for any reason to run the tests using an actual connection on a mongo instance, add the environment variable `MONGO_DB`:

```bash
docker run --name mongo_fuzzy_test -p 27017:27017 -d mongo
MONGO_DB=true npm test
```

### Available test suites

#### unit tests

```bash
npm run test:unit
```

#### Integration tests

```bash
npm run test:integration
```

## License

MIT License

## Credit

Credit goes to the original package owner [VassilisPallas](https://github.com/VassilisPallas/mongoose-fuzzy-searching)
