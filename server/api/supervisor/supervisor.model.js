'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SupervisorSchema = new Schema({
  name: String,
  email: String,
  type: String
});

module.exports = mongoose.model('Supervisor', SupervisorSchema);