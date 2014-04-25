var express = require('express'),
    router = express.Router(),
    oauth = {};

/* GET home page. */
oauth.all = function(app){
  router.all('/token', app.oauth.grant());
  router.all('/authCode', app.oauth.authCodeGrant());

  return router
}

module.exports = oauth;
