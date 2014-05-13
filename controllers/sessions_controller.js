var db = require('../models/index'),
    User = db.User,
    bcrypt = require('bcrypt');

var SessionsController = {

  new: function(req, res, next) {
    res.render('login');
  },

  create: function(req, res, next) {
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

        SessionsController.signIn(req, res, user);
      });
  },

  destroy: function(req, res, next) {
    req.session.userId = null;
    req.session.user = null;
    res.redirect('/login');
  },

  signIn: function(req, res, user){
    req.session.userId = user.id;
    req.session.user = user;

    if (req.session.originalUrl) {
      var redirectUrl = req.session.originalUrl;

      req.session.originalUrl = null;
      res.redirect(redirectUrl);
    }else{
      res.redirect("/users/" + user.id);
    }
  }
};

module.exports = SessionsController;
