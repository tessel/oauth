var express = require('express'),
    router = express.Router(),
    oauthRoutes = {},
    db = require('../models/db')

/* GET home page. */
oauthRoutes.all = function(oauth){
  router.all('/token', oauth.grant());
  router.post('/authorise', function(req, res, next){
    db.User
      .find({ where: { username: req.body.username, password_digest: req.body.password } })
      .success(function(user){
        if (user){
          req.user = user;
          next();
        }else{
          res.render('oauth/authorise', req.body);
        }
      })
      .error(function(err){
        res.render('oauth/authorise', req.body);
      });
  }, oauth.authCodeGrant(function(req, next) {
    next(null, req.body.allow === 'yes', req.user.id, null);
  }));

  return router;
}

module.exports = oauthRoutes;
