/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);


// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var io = require('socket.io')(server);
io.on('connection', function(client) {

        console.log('a user connected: ' + client.id);
        console.log("****************** client connected ************");

          client.on('trigerEvent', function(objLastCallLog){
        console.log('trigger is on '+objLastCallLog);
        client.broadcast.emit('timeline',objLastCallLog);

         })

        client.on('disconnect', function(){
        console.log( ' has disconnected from the chat.' + client.id);

        });

});

// Expose app
exports = module.exports = app;