var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt'),
    db = require('../models/db'),
    index = {};

index.all = function(oauth){
  /* GET home page. */
  router.get('/', oauth.authorise(), function(req, res) {
    res.render('index', { title: 'Express' });
  });

  router.get('/login', function(req, res) {
    res.render('login', { title: 'Login' });
  });

  router.post('/login', function(req, res, next) {
    db.User
    .find({ where: { username: req.body.username } })
    .success(function(user){
      if (user){
        req.session.userId = user.id;
        if (bcrypt.hashSync(req.body.password, user.passwordDigest)){
          if (req.body.client_id && req.body.redirect_uri){
            res.render('oauth/authorise', {
              title: 'Authorise',
              user: user,
              client_id: req.body.client_id,
              redirect_uri: req.body.redirect_uri
            });
          }else{
            res.render('users/show', {
              title: 'User profile',
              user: user
            });
          }
          return;
        }
      }
      res.render('login', {
        title: 'Login',
        user: user
      });
    })
    .error(function(err){
       console.log("ERROR ====>", err);
       res.render('login', {
          title: 'Login',
       });
    });
  });

  router.get('/logout', oauth.authorise(), function(req, res) {
    res.render('logout', { title: 'Express' });
  });
  return router;
};

module.exports = index;
