var models  = require('../models');
var express = require('express');
var router  = express.Router();
var passport = require('passport');
var debug = require('debug')('adminRouter');

router.post('/login', passport.authenticate('local'), function(req, res) {
	debug('Authenticated!');
	debug(req.session);
	res.send(req.user);
});

router.post('/logout', function(req, res) {
	req.logOut(); 
	res.sendStatus(200);
});

module.exports = router;