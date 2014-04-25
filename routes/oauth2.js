var express = require('express'),
    router = express.Router(),
    oauthRoutes = {};

/* GET home page. */
oauthRoutes.all = function(oauth){
  router.all('/token', oauth.grant());
  router.post('/authorise', oauth.authCodeGrant(function(req, next) {
    // The first param should to indicate an error
    // The second param should a bool to indicate if the user did authorise the app
    // The third param should for the user/uid (only used for passing to saveAuthCode)
    next(null, req.body.allow === 'yes', req.body.userId, null);
  }
  ));

  return router;
}

module.exports = oauthRoutes;
