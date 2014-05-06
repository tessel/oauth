var db = require('../models/index'),
    User = db.User,
    bcrypt = require('bcrypt');

var SessionsController = function(){ };

SessionsController.prototype.new = function(req, res, next) {
  res.render('login', {
    title: 'Login',
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri,
    response_type: req.query.response_type
  });
}

SessionsController.prototype.create = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password;

  User
    .find({ where: { username: username } })

    .error(function(err) {
      console.log(err);
      res.render('login', { title: 'Login' });
    })

    .success(function(user) {
      if ((!user) || (!bcrypt.compareSync(password, user.passwordDigest))) {
        return res.redirect('/login' + req._parsedUrl.search);
      }

      req.session.userId = user.id;
      req.session.currentUser = user;

      if (req.body.client_id && req.body.redirect_uri) {
        return res.render('oauth/authorise', {
          title: 'Authorize',
          user: user,
          client_id: req.body.client_id,
          redirect_uri: req.body.redirect_uri,
          response_type: req.body.response_type
        });
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
