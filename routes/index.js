var express = require('express'),
    router = express.Router(),
    index = {};

index.all = function(oauth){
  /* GET home page. */
  router.get('/', oauth.authorise(), function(req, res) {
    res.render('index', { title: 'Express' });
  });

  return router;
};

module.exports = index;
