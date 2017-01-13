// Load required packages
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var debug = require('debug')('auth');

var Admin = require('../models').Admin;


passport.use(new LocalStrategy(
	function (username, password, done) {
		Admin.findOne({
			where: { username: username }
		}).then(function (admin) {
			if (!admin) {
				debug('Bad Username.');
				return done(null, false, { message: 'Incorrect username.' });
			}
			bcrypt.compare(password, admin.password, function(err, result) {
				if (!result) {
					debug('Bad Password.');
					return done(null, false, { message: 'Incorrect password.' });
				}
				debug('User Found!');
				return done(null, admin);
			});
		}, function (err) {
			debug('Error: ' + err);
			return done(err);
		});
	}));

passport.serializeUser(function (admin, done) {
	debug('Serialize Succeeded: ' + admin);
	done(null, admin.id);
});

passport.deserializeUser(function (adminId, done) {
	debug('Deserialize.... ' + adminId);
	Admin.find({
		where: { id: adminId }
	}).then(function (dbAdmin) {
		debug('Deserialize Succeeded: ' + dbAdmin);
		done(null, dbAdmin);
	}, function (err) {
		debug('Deserialize Error');
		done(err);
	});
});

exports.isAuthenticated = function (req, res, next) {
	debug(req.session);
	if (req.isAuthenticated()) { return next(); }
	res.sendStatus(401);
};
