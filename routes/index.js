var Router = require('express').Router;
var admin = require('./admin');
var options = require('./options');
var surveys = require('./surveys');
var debug = require('debug')('routes');


var router = new Router();

router
  .get('/loggedin', function (req, res) {
    if (req.isAuthenticated()) {
      debug('User is logged in');
      res.json({ authenticated: true });
    } else {
      debug('User is NOT logged in');
      res.sendStatus(401);
    }
  })
  .use('/admin', admin)
  .use('/options', options)
  .use('/surveys', surveys);

module.exports = router;
