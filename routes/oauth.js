var express = require('express'),
    router = express.Router(),
    oauthRoutes = {},
    db = require('../models/db')

oauthRoutes.all = function(oauth){
  /* ALL verify grant and accesss token credentials. */
  router.all('/token', oauth.grant());

  /* POST verufy user login and authorization access */
  router.post('/authorise', function(req, res, next){
    db.User
      .find({ where: { id: req.session.userId } })
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
    next(null, req.body.allow === 'yes', req.session.userId, null);
  }));

  /* GET User Authorise and login form. */
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
}

module.exports = oauthRoutes;
