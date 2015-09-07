'use strict';

var express = require('express');
var controller = require('./call.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();



router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/supervisor/:id', auth.isAuthenticated(), controller.supervisor);
router.get('/token/:id',  auth.isAuthenticated(), controller.token);
router.post('/flag/:id',  auth.isAuthenticated(), controller.flag);
router.get('/getFlag/:id', auth.isAuthenticated(), controller.getFlag);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;