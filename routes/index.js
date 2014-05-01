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

  /* GET Register new user redirects to users/new. */
  router.get('/register', function(req, res) {
    res.redirect('/users/new');
  });

  return router;
};

module.exports = index;
