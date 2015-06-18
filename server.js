var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var auth = require('./auth');
var debug = require('debug')('main');

var routes = require('./routes/index');
var admin  = require('./routes/admin');
var surveys  = require('./routes/surveys');
var options  = require('./routes/options');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    store: new FileStore(options),
    name: 'sessionId',
    secret: 'sumosecret',
    resave: false,
    saveUninitialized: false,
    rolling: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());


app.get('/', routes.index);
app.get('/login', routes.index);
app.get('/admin/*', routes.index);
app.get('/loggedin', routes.loggedin);
app.get('/partials/:name', routes.partials);

app.use('/api/admin', admin);
app.use('/api/surveys', surveys);
app.use('/api/options', options);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;