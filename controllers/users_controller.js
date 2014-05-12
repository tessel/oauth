var db = require('../models/index'),
    User = db.User,
    AccessToken = db.AccessToken,
    sessions = require('./sessions_controller.js');

var UsersController= function(){ };

UsersController.prototype.new = function(req, res, next){
  res.render('users/new', {
    title: 'Register new user',
    user: User.build(req.body.user)
  });
};

UsersController.prototype.create = function(req, res, next){
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

UsersController.prototype.profile = function(req, res, next){
  var accessToken = req.query.access_token || req.body.access_token;

  AccessToken
    .find({ where: { accessToken: accessToken } })

    .success(function(token){
      if (!token) return res.send(304, { error: { message: 'Invalid token.' } });

      User
        .find({ where: { id: token.userId } })
        .success(function(user){
          res.send({
            username: user.username,
            email: user.email,
            apiKey: user.apiKey,
            name: user.name
          });
        })
        .error(function(err){
          console.log('ERROR:', err);
          res.send(500, err);
        });
    })

    .error(function(err){
      console.log('ERROR', err);
      res.send(500, err);
    });
};

UsersController.prototype.show = function(req, res, next){
  var errors = [],
      user = req.session.currentUser;

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
}

module.exports = new UsersController();
