// Load required packages
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models');
var debug = require('debug')('auth');

passport.use(new LocalStrategy(
	function (username, password, done) {
		models.Admin.findOne({
			where: { username: username }
		}).then(function (admin) {
			if (!admin) {
				debug('Bad Username.');
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (admin.password !== password) {
				debug('Bad Password: ' + admin.password + '!==' + password);
				return done(null, false, { message: 'Incorrect password.' });
			}
			debug('User Found!');
			return done(null, admin);
		}, function (err) {
			debug('Error: ' + err);
			return done(err);
		});
	}));

passport.serializeUser(function(admin, done) {
	debug('Serialize Succeeded: ' + admin);
    done(null, admin.id);
});

passport.deserializeUser(function(adminId, done) {
	debug('Deserialize.... ' + adminId);
	models.Admin.find({
		where: {id: adminId}
	}).then(function(dbAdmin) {
		debug('Deserialize Succeeded: ' + dbAdmin);
		done(null, dbAdmin.id);
	}, function(err) {
		debug('Deserialize Error');
		done(err);
	});
});

exports.isAuthenticated = function (req, res, next) {
	debug(req.session);
	if (req.isAuthenticated()) { return next(); }
	res.sendStatus(401);
};