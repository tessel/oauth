var router = require('express').Router(),
    appController = require('../controllers/application_controller.js'),
    oauthController = require('../controllers/oauth_controller.js');

module.exports = {
  all: function(oauth){
    // ALL /oauth/token
    //
    // Verify grant and access token credentials
    router.all('/token', oauth.grant());

    // POST /oauth/authorise
    //
    // Verify user login and authorization access
    router.post('/authorise', appController.authenticateUser, oauth.authCodeGrant(oauthController.createAuth));

    // GET /oauth/authorize
    //
    // Display user authorization and login form
    router.get('/authorise', appController.authenticateUser, oauthController.newAuth);

    return router;
  }
}
