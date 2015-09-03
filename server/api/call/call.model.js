'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CallSchema = new Schema({
  time: Date,
  user: String,
  supervisor: String,
  duration: String
});

module.exports = mongoose.model('Call', CallSchema);