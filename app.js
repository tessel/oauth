// first, load environment settings from .env file; if it exists
require('dotenv').load();

var path = require('path');

var express = require('express'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var routes = require('./routes/index'),
    users = require('./routes/users');

var db = require('./models/db');

var app = express(),
    oauthserver = require('node-oauth2-server');

// Configure OAuth2 server
var oauth = oauthserver({
    model: require('./oauth2/model'),
    grants: ['password'],
    debug: true
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// Use OAuth2 handler and error handler
app.use(oauth.handler());
app.use(oauth.errorHandler());

app.use('/', routes);
app.use('/users', users);

// Setup and Sync Database and load models
db.sequelize
  .sync({ force: true })
  .complete(function(err){
    if (err) {
      console.log(err);
      process.exit();
    }

    console.log('DB Synced Successfully');
  });

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
