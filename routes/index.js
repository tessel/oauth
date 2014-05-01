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

  return router;
};

module.exports = index;
