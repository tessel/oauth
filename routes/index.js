var express = require('express'),
    router = express.Router(),
    index = {};

index.all = function(oauth){
  /* GET home page. */
  router.get('/', oauth.authorise(), function(req, res) {
    res.render('index', { title: 'Express' });
  });
  router.get('/authorise', function(req, res){
    var params={
      title: 'Authorise access',
      response_type: req.query.response_type,
      client_id: req.query.client_id,
      redirect_uri: req.query.redirect_uri
    };
    res.render('oauth/authorise', params);
  });

  return router;
};

module.exports = index;
