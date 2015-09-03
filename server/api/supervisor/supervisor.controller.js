'use strict';

var _ = require('lodash');
var Supervisor = require('./supervisor.model');

// Get list of supervisors
exports.index = function(req, res) {
  Supervisor.find(function (err, supervisors) {
    if(err) { return handleError(res, err); }
    return res.json(200, supervisors);
  });
};

// Get a single supervisor
exports.show = function(req, res) {
  Supervisor.findById(req.params.id, function (err, supervisor) {
    if(err) { return handleError(res, err); }
    if(!supervisor) { return res.send(404); }
    return res.json(supervisor);
  });
};

// Creates a new supervisor in the DB.
exports.create = function(req, res) {
  Supervisor.create(req.body, function(err, supervisor) {
    if(err) { return handleError(res, err); }
    return res.json(201, supervisor);
  });
};

// Updates an existing supervisor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Supervisor.findById(req.params.id, function (err, supervisor) {
    if (err) { return handleError(res, err); }
    if(!supervisor) { return res.send(404); }
    var updated = _.merge(supervisor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, supervisor);
    });
  });
};

// Deletes a supervisor from the DB.
exports.destroy = function(req, res) {
  Supervisor.findById(req.params.id, function (err, supervisor) {
    if(err) { return handleError(res, err); }
    if(!supervisor) { return res.send(404); }
    supervisor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}