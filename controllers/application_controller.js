var db = require('../models/index')
    , User = db.User
    , passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , GitHubStrategy = require('passport-github').Strategy
    ;

var ApplicationController = {};

ApplicationController.auth = function(req, res, next){
  var redirectToLogin = function(){
    req.session.originalUrl = req.originalUrl;
    req.session.user = null;
    req.session.userId = null;
    res.redirect('/login');
  }

  // console.log("app auth", req.session.userId, req.isAuthenticated(), req.session.user, req.user);

  if (req.session.userId || req.isAuthenticated()){
    if (req.session.user ){
      next();
    } else if (req.user) {
      req.session.userId = req.user.id;
      req.session.user = req.user;
      next();
    }else{
      User
        .find({ where: { id: req.session.userId } })

        .success(function(user) {
          if (user) {
            req.session.user = user;
            next();
          }else {
            redirectToLogin();
          }
        })

        .error(function(err){
          console.log('Error ===>' , err);
          redirectToLogin();
        })
    }
  }else{
    redirectToLogin();
  }
};

// passport setup 
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // console.log("google auth", accessToken, refreshToken, profile);
      User
        .find({ where: { email: profile._json.email } })
        .success(function(user) {
          if (user) {
            return done(null, user);
          }
          else {
            User
              .create({
                username: profile._json.email,
                email: profile._json.email,
                name: profile._json.name,
                accessToken: accessToken
              })
              .success(function(userC) {
                return done(null, userC);
              })
              .error(function(err) {
                console.log("user creation error", err);

                return done(null, profile);
              });
          }
        })
        .error(function(err) {
          return done(null, profile);
        });
    });
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    // console.log("github auth", accessToken, refreshToken, profile);

    process.nextTick(function () {
      User
        .find({ where: { email: profile._json.email } })
        .success(function(user) {
          if (user) {
            return done(null, user);
          }
          else {
            User
              .create({
                username: profile._json.login,
                email: profile._json.email,
                name: profile._json.name,
                accessToken: accessToken
              })
              .success(function(userC) {
                return done(null, userC);
              })
              .error(function(err) {
                console.log("user creation error", err);
                return done(null, profile);
              });
          }
        })
        .error(function(err) {
          return done(null, profile);
        });
    });
  }
));

ApplicationController.oauth = function(req, res){

};

ApplicationController.callbackAuth = function(req, res){
  res.redirect('/user');
};

module.exports = ApplicationController;
