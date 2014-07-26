var db = require('../models/index')
    , User = db.User
    , passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , GitHubStrategy = require('passport-github').Strategy
    , ssoUtil = require('../utils/sso')
    , Sessions = require('./sessions_controller')
    , request = require('request')
    ;

var ApplicationController = {};

ApplicationController.auth = function(req, res, next){
  var redirectToLogin = function(){
    req.session.originalUrl = req.originalUrl;
    req.session.user = null;
    req.session.userId = null;
    res.redirect('/login');
  }

  if (req.session.userId || req.isAuthenticated()){
    if (req.session.user ){
      Sessions.signIn(req, res, req.session.user, next);
    } else if (req.user) {
      req.session.userId = req.user.id;
      req.session.user = req.user;
      Sessions.signIn(req, res, req.session.user, next);
    }else{
      User
        .find({ where: { id: req.session.userId } })

        .success(function(user) {
          if (user) {
            req.session.user = user;
            Sessions.signIn(req, res, req.session.user, next);
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
          } else {

            var tempUser = {
              // splice out @
              username: profile._json.email.split('@')[0],
              email: profile._json.email,
              name: profile._json.name,
              accessToken: accessToken,
              needToCreate: true
            }

            return done(null, tempUser);

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

    process.nextTick(function () {
      // get the user email
      var userEmail = profile._json.email;
      if (!userEmail) {
        var options = {
          url: 'https://api.github.com/user/emails?access_token='+accessToken,
          headers: {'User-Agent': 'tessel-auth'}
        }
        request(options, function(e, r, body) {
          if (!e) {
            var res = JSON.parse(body);
            // find the one associated as "primary";
            res = res.filter(function(e){
              return e.primary && e.verified;
            })
            if (res.length > 0) {
              userEmail = res[0];
              generateUser();
            } else {
              return failure("The primary email associated with this Github account is unverified. Please verify it on Github first.");
            }
          } else {
            // error getting email
            return failure("Could not get user email from Github.");
          }
        });
      } else {
        generateUser();
      }

      function failure(message){
        return done(null, false, { message: message });
      }

      function generateUser() {
        User
          .find({ where: { email: userEmail } })
          .success(function(user) {
            if (user) {
              return done(null, user);
            } else {
              var tempUser = {
                username: profile._json.login,
                email: userEmail,
                name: profile._json.name,
                accessToken: accessToken, 
                needToCreate: true
              }

              return done(null, tempUser);
            }
          })
          .error(function(err) {
            return failure("We had an error checking for "+userEmail);
          });
      }
      
    });
  }
));

ApplicationController.oauth = function(req, res){

};

ApplicationController.callbackAuth = function(req, res){
  
  if (req.user && req.user.needToCreate) {
    req.session.tempUser = req.user;
    // if we need to create a user redirect to /new
    return res.redirect('/users/new');
  }

  Sessions.signIn(req, res, req.user, function(){
    res.redirect('/user');
  });
};

module.exports = ApplicationController;
