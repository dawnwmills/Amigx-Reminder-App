'use strict';

const mongoose = require('mongoose');
const cfg = require('../config');
const MongoInMemory = require('mongo-in-memory');


if (!cfg.mongoUrlTest) {
  throw new Error('MONGO_URL_TEST env variable not set.');
}

// 
mongoose.Promise = Promise;
exports.mongoConnection =mongoose.connect(cfg.mongoUrlTest, {
  useMongoClient: true
});



