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
  res.render('login');
};

SessionsController.create = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password;

  User
    .find({ where:
      Sequelize.or({email: username }
        , {username: username}) })
    .error(function(err) {
      return res.redirect('/login');
    })
    .success(function(user) {
      if ((!user) || (!bcrypt.compareSync(password, user.passwordDigest))) {
        return res.redirect('/login');
      }

      SessionsController.signIn(req, res, user);
    });
};

SessionsController.destroy = function(req, res, next) {
  req.session.userId = null;
  req.session.user = null;
  res.redirect('/login');
};

SessionsController.signIn = function(req, res, user){
  req.session.userId = user.id;
  req.session.user = user;

  if (req.session.redirect && req.session.sso_secret && req.session.nonce) {
    var query = ssoUtil.cleanUser(req.session.nonce, req.session.user
      , req.session.sso_secret)

    var redirect = req.session.redirect;
    req.session.redirect = null;
    req.session.sso_secret = null;
    req.session.nonce = null;
    
    res.redirect(redirect+query);
  } else if (req.session.originalUrl) {
    var redirectUrl = req.session.originalUrl;

    req.session.originalUrl = null;
    return res.redirect(redirectUrl);
  } else {
    res.redirect("/user");
  }
};

module.exports = SessionsController;
