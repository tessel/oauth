var router = require('express').Router();

var App = require('./controllers/application_controller'),
    OAuth = require('./controllers/oauth_controller'),
    Sessions = require('./controllers/sessions_controller'),
    Pages = require('./controllers/pages_controller'),
    Users = require('./controllers/users_controller');

module.exports = function(oauth) {
  // OAuth routes
  router.all('/oauth/token', oauth.grant());
  router.post('/oauth/authorise', App.auth, oauth.authCodeGrant(OAuth.createAuth));
  router.get('/oauth/authorise', App.auth, OAuth.newAuth);

  // Login routes
  router.get('/login', Sessions.new);
  router.post('/login', Sessions.create);
  router.get('/signup', Users.new);
  router.post('/signup', Users.create);
  router.get('/reset', Users.resetForm);
  router.post('/reset', Users.reset);
  router.post('/resetPassword', Users.resetPassword);
  router.all('/logout', Sessions.destroy);

  // Index routes
  router.get('/', Pages.index);
  router.get('/register', Pages.register);

  // Users routes
  router.get('/users/new', Users.new);
  router.all('/users/profile', oauth.authorise(), Users.profile);
  router.get('/users/:id', App.auth, Users.show);
  router.get('/users/:id/genApiKey', App.auth, Users.genApiKey);

  return router;
};
