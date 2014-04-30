// first, load environment settings from .env file; if it exists
require('dotenv').load();
process.env.NODE_ENV = process.env.NODE_ENV || "development";

var path = require('path');

var express = require('express'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var oauthserver = require('node-oauth2-server');

var routes = {
  index: require('./routes/index'),
  users: require('./routes/users'),
  oauth: require('./routes/oauth')
};

var db = require('./models/db');

var app = express();

// Configure OAuth2 server
app.oauth = oauthserver({
  model: require('./models/oauth'),
  grants: ['password', 'authorization_code', 'refresh_token'],
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

// Use OAuth to grant tokens
app.use('/oauth', routes.oauth.all(app.oauth));
app.use('/',      routes.index.all(app.oauth));
app.use('/users', routes.users);

// Setup and Sync Database and load models
db.sequelize
  //.sync({ force: true })
  .sync()
  .complete(function(err){
    if (!!err) {
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

// Use OAuth2 error handler
app.use(app.oauth.errorHandler());

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

process.on('uncaughtException', function (err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
});

module.exports = app;
