'use strict';

var _ = require('lodash');
var Call = require('./call.model');
var request = require('request');
var socket = require('socket.io-client')('http://localhost:9000');


// Get list of calls
exports.index = function(req, res) {
  Call.find(function (err, calls) {
    if(err) { return handleError(res, err); }
    return res.json(200, calls);
  });
};

// Get a single call
exports.show = function(req, res) {
  Call.findById(req.params.id, function (err, call) {
    if(err) { return handleError(res, err); }
    if(!call) { return res.send(404); }
    return res.json(call);
  });
};

// get calls for supervisor
exports.supervisor = function(req, res) {
  Call.find({supervisor : req.params.id}, function (err, call) {
    if(err) { return handleError(res, err); }
    if(!call) { return res.send(404); }
     return res.json(call);
  });
};


// get the token from heroku
exports.token = function(req, res) {
request('https://yamsafer-call.herokuapp.com/do', function (error, response, body) {
  if (!error && response.statusCode === 200) {
    return res.json(body);
  }
});

};

// to the heruko server
exports.setFlag = function(req, res) {
request.post(
    'https://yamsafer-call.herokuapp.com/setFlag',
    { form: { flag: req.body.id,
                    key: '5c752bc120b33be132a4366f15559c7c'
     } },
    function (error, response, body) {
        if (!error && response.statusCode === 200) {
        }
    }
);

};

exports.getCall = function(req, res) {
request.post(
    'https://yamsafer-call.herokuapp.com/getCall',
    { form: { clinet: 'jenny',
                    key: '5c752bc120b33be132a4366f15559c7c'
     } },
    function (error, response, body) {
      console.log(body)
        if (!error && response.statusCode === 200) {
        }
    }
);

};

exports.getQueue = function(req, res) {

  request('https://yamsafer-call.herokuapp.com/getQueue', function (error, response, body) {
  if (!error && response.statusCode === 200) {
      console.log(body)
  res.json(response);
  }
});

};

exports.updateQueue = function(req, res) {


    // var socketOut = ioOut.connect('http://localhost:9000', {
    //     'force new connection': true
    // });
    res.json(req.params.id);
    return socket.emit('trigerEvent', req.params.id);
    // return "Hello";
    // socket.on('event', function(data){});

};


exports.getFlag = function(req, res) {
request('https://yamsafer-call.herokuapp.com/getFlag', function (error, response, body) {
  if (!error && response.statusCode === 200) {
    return res.json(body);
  }
});

};


// Creates a new call in the DB.
exports.create = function(req, res) {
  console.log("in create ! ");
  console.log(req.body);
  Call.create(req.body, function(err, call) {
    if(err) { return handleError(res, err); }
    return res.json(201, call);
  });
};

// Updates an existing call in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Call.findById(req.params.id, function (err, call) {
    if (err) { return handleError(res, err); }
    if(!call) { return res.send(404); }
    var updated = _.merge(call, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, call);
    });
  });
};

// Deletes a call from the DB.
exports.destroy = function(req, res) {
  Call.findById(req.params.id, function (err, call) {
    if(err) { return handleError(res, err); }
    if(!call) { return res.send(404); }
    call.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}