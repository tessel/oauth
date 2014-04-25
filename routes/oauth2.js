var express = require('express'),
    router = express.Router(),
    oauth = {};

/* GET home page. */
oauth.all = function(app){
  router.all('/token', app.oauth.grant());

  return router
}

module.exports = oauth;
