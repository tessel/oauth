var db = require('../models/index'),
    User = db.User,
    bcrypt = require('bcrypt');

var SessionsController = function(){ };

SessionsController.prototype.new = function(req, res, next) {
  res.render('login');
}

SessionsController.prototype.create = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password;

  User
    .find({ where: { username: username } })

    .error(function(err) {
      return res.redirect('/login');
    })

    .success(function(user) {
      if ((!user) || (!bcrypt.compareSync(password, user.passwordDigest))) {
        return res.redirect('/login');
      }

      req.session.userId = user.id;
      req.session.currentUser = user;

      if (req.session.originalUrl) {
        var redirectUrl = req.session.originalUrl;
        req.session.originalUrl = null;
        return res.redirect(redirectUrl);
      }

      res.redirect("/users/" + user.id);
    });
}

SessionsController.prototype.destroy = function(req, res, next) {
  req.session.userId = null;
  req.session.currentUser = null;
  res.redirect('/login');
}

module.exports = new SessionsController();
