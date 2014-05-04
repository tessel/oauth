var db = require('../database/model'),
    User = db.User;

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
      req.session.userId = user.id;
      res.redirect('/users/show');
    })

    .error(function(err) {
      res.render('users/new', {
        title: 'Register new user',
        user: req.body.user
      });
    });
};

UsersController.prototype.profile = function(req, res, next){
  User
    .find({ where: { id: req.params.id } })

    .success(function(user){
      res.send(302, {
        id: user.id,
        username: user.username,
        apiKey: user.apiKey,
        name: user.name
      });
    })

    .error(function(err){
      res.send(err);
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
