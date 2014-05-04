var router = require('express').Router(),
    bcrypt = require('bcrypt');

var db = require('../database/model'),
    User = db.User;

router.get('/login', function(req, res) {
  return res.render('login', {
            title: 'Login',
            client_id: req.query.client_id,
            redirect_uri: req.query.redirect_uri,
            response_type: req.query.response_type
          });
});

router.post('/login', function(req, res, next) {
  var username = req.body.username,
      password = req.body.password;

  User
    .find({ where: { username: username } })

    .error(function() {
      res.render('login', { title: 'Login' });
    })

    .success(function(user) {
      if (!user) {
        return res.render('login', { title: 'Login' });
      }

      if (bcrypt.compareSync(password, user.passwordDigest)) {
        req.session.userId = user.id;

        if (req.body.client_id && req.body.redirect_uri) {
          return res.render('oauth/authorise', {
            title: 'Authorize',
            user: user,
            client_id: req.body.client_id,
            redirect_uri: req.body.redirect_uri,
            response_type: req.body.response_type
          });
        }

        res.redirect("/users/show");
      }
    });
});

router.all('/logout', function(req, res) {
  req.session.userId = null;
  res.redirect('/login');
});

module.exports = router;
