var db = require('../models/index')
    , User = db.User
    , Sequelize = require('sequelize')
    , bcrypt = require('bcrypt')
    , ssoUtil = require('../utils/sso')
    ;

var SessionsController = {};

SessionsController.new = function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/user');
  }
  var args = {};
  if (req.query.err) {
    args['loginErr'] = "The username/password did not match";
  } else if (req.query.githubErr) {
    args['failure'] = req.session.githubErr;
    delete req.session.githubErr;
  }
  return res.render('login', args);
};

SessionsController.create = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password;

  User
    .find({ where:
      Sequelize.or({email: username }
        , {username: username}) })
    .error(function(err) {
      return res.redirect('/login/?err=login');
    })
    .success(function(user) {
      if ((!user) || (!bcrypt.compareSync(password, user.passwordDigest))) {
        return res.redirect('/login/?err=login');
      }
      
      SessionsController.signIn(req, res, user, next);
    });
};

SessionsController.destroy = function(req, res, next) {
  req.session.userId = null;
  req.session.user = null;
  req.session.sso_secret = null;
  req.session.nonce = null;
  if (req.user) {
    req.logout();
  }
  res.redirect('/');
};

SessionsController.signIn = function(req, res, user, next){
  req.session.userId = user.id;
  req.session.user = user;

  if (req.session.tempUser) {
    req.session.tempUser = null;
  }

  if (req.session.redirect && req.session.sso_secret && req.session.nonce) {
    var query = ssoUtil.cleanUser(req.session.nonce, req.session.user
      , req.session.sso_secret)

    var redirect = req.session.redirect;
    req.session.redirect = null;
    req.session.sso_secret = null;
    req.session.nonce = null;

    return res.redirect(redirect+query);
  } else if (req.session.originalUrl) {
    var redirectUrl = req.session.originalUrl;

    req.session.originalUrl = null;
    return res.redirect(redirectUrl);
  } else {
    next && next();
  }
};

module.exports = SessionsController;
