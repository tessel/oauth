var db = require('../models/index'),
    User = db.User,
    AccessToken = db.AccessToken,
    sessions = require('./sessions_controller.js');

var UsersController = {};

UsersController.new = function(req, res, next){
  res.render('users/new', {
    title: 'Register new user',
    user: User.build(req.body.user)
  });
};

UsersController.create = function(req, res, next){
  var newUser = req.body.user;

  User
    .create(newUser)

    .success(function(user) {
      sessions.signIn(req, res, user);
    })

    .error(function(err) {
      console.log('ERROR:', err);
      res.render('users/new', {
        title: 'Register new user',
        user: req.body.user
      });
    });
};

UsersController.profile = function(req, res, next){
  var accessToken = req.query.access_token || req.body.access_token;

  AccessToken
    .find({ where: { accessToken: accessToken }, include: [User] })

    .success(function(token){
      if (!token) return res.send(304, { error: { message: 'Invalid token.' } });

      var user = token.user;

      res.send({
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
        name: user.name
      });

    })

    .error(function(err){
      console.log('ERROR', err);
      res.send(500, err);
    });
};

UsersController.show = function(req, res, next){
  var errors = [],
      user = req.session.user;

  if (user.id != req.params.id) {
    req.params.id = user.id;
    errors.push({ message: 'You do not have sufficient permissions to access requested resource.' });
  }

  if (user){
    res.render('users/show', {
      title: 'User Profile',
      user: user,
      errors: errors
    });
  }else{
    return res.redirect('/login');
  }
};

UsersController.genApiKey = function(req, res, next) {
  var errors = [];

  if (req.session.user.id != req.params.id) {
    req.params.id = req.session.user.id;
    errors.push({ message: 'You do not have sufficient permissions to access requested resource.' });
  }

  User
    .find({ where: { id: req.session.user.id } })

    .success(function(user) {
      if (user){
        user
          .genApiKey()
          .save()
          .success(function() {
            req.session.user = user;
            res.redirect('/users/' + user.id);
          })
          .error(function() {
            errors.push({ message: 'An error occured while updating user profile.' });
            res.render('users/show', {
              title: 'User Profile',
              user: user,
              errors: errors
            });
          });
      }else{
        return res.redirect('/login');
      }
    })

    .error(function(err) {
      return res.redirect('/login');
    });
};

module.exports = UsersController;
