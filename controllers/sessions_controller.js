var db = require('../models/index'),
    User = db.User,
    bcrypt = require('bcrypt');

var SessionsController = function(){ };

SessionsController.prototype.new = function(req, res, next) {
  res.render('login');
}

SessionsController.prototype.create = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password,
      sessions = new SessionsController();

  User
    .find({ where: { username: username } })

    .error(function(err) {
      return res.redirect('/login');
    })

    .success(function(user) {
      if ((!user) || (!bcrypt.compareSync(password, user.passwordDigest))) {
        return res.redirect('/login');
      }

      sessions.signIn(req, res, user);
    });
}

SessionsController.prototype.destroy = function(req, res, next) {
  req.session.userId = null;
  req.session.currentUser = null;
  res.redirect('/login');
}

SessionsController.prototype.signIn = function(req, res, user){
  req.session.userId = user.id;
  req.session.currentUser = user;

  if (req.session.originalUrl) {
    var redirectUrl = req.session.originalUrl;

    req.session.originalUrl = null;
    res.redirect(redirectUrl);
  }else{
    res.redirect("/users/" + user.id);
  }
}

module.exports = new SessionsController();
