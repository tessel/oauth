var router = require('express').Router();

var App = require('./controllers/application_controller')
    , OAuth = require('./controllers/oauth_controller')
    , Sessions = require('./controllers/sessions_controller')
    , Pages = require('./controllers/pages_controller')
    , Users = require('./controllers/users_controller')
    , passport = require('passport')
    , SSO = require('./controllers/sso_controller')
    ;

module.exports = function(oauth) {
  // Proxy server API routes
  router.all('/proxy', App.proxyServerAuth);
  router.get('/proxy/verify', Users.verifyProxyKey);
  
  // OAuth routes
  router.all('/oauth/token', oauth.grant());
  router.post('/oauth/authorise', App.auth, oauth.authCodeGrant(OAuth.createAuth));
  router.get('/oauth/authorise', App.auth, OAuth.newAuth);

  // Login routes
  router.get('/login', Sessions.new);
  router.post('/login', Sessions.create, Users.show);
  router.get('/signup', Users.new);
  router.post('/signup', Users.create);
  router.get('/reset', Users.resetForm);
  router.post('/reset', Users.reset);
  router.post('/resetPassword', Users.resetPassword);
  router.all('/logout', Sessions.destroy);

  // Index routes
  // router.get('/', Pages.index);
  router.all('/', App.auth, Users.show);
  router.get('/register', Pages.register);

  // Users routes
  router.get('/users/new', Users.new);
  router.all('/users/profile', oauth.authorise(), Users.profile);
  router.get('/user', App.auth, Users.show);
  router.get('/users/genApiKey', App.auth, Users.genApiKey);

  // Github Auth Routes
  router.get('/auth/github', passport.authenticate('github', {scope: 'user:email'}), App.oauth);
  router.get('/auth/github/callback', function(req, res, next) {
    passport.authenticate('github', function(err, user, info) {
      if (!user) {
        req.session.githubErr = info.message;
        return res.redirect('/login?githubErr=true')
      }
      req.user = user;
      next();
    })(req, res, next);
  }, App.callbackAuth);

  // Google Auth Routes
  router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'], accessType: 'offline'  }), App.oauth);
  router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), App.callbackAuth);


  // sso auth routes
  router.get('/sso/discourse', SSO.discourse);
  router.get('/sso/portal', SSO.portal);

  // sso auth logout routes
  router.get('/sso/logout', SSO.logout);
  return router;
};
