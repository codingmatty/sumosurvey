var path = require('path');
var logger = require('morgan');
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug')('main');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var routes = require('./routes');
var auth = require('./utils/auth');
var sequelize = require('./utils/sequelize');
var seed = require('./utils/seed');
require('./models'); // init sequelize models

sequelize.sync({ force: true }).then(function () {
  seed();
  var app = createServerApp();
  var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
  });
})

function createServerApp() {
  var app = express();

  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(session({
    secret: 'sumosecret',
    store: new SequelizeStore({
      db: sequelize
    }),
    resave: false,
    saveUninitialized: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api', routes);
  app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('public/partials/' + name);
  });

  app.get('/admin', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/admin/list');
      return;
    }
    res.redirect('/login');
  });

  app.get('/login', function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/admin/list');
      return;
    }
    next();
  })

  // Default to index.html
  app.use(function (req, res) {
    res.render(path.resolve('public/index'), {
      environment: process.env.NODE_ENV,
      loggedIn: !!req.isAuthenticated(),
      user: JSON.stringify(req.user || {})
    });
  });

  app.set('port', process.env.PORT || 3000);

  return app;
}
