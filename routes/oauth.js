var router = require('express').Router();

var db = require('../models/db'),
    User = db.User;

module.exports = {
  all: function(oauth){
    // ALL /oauth/token
    //
    // Verify grant and access token credentials
    router.all('/token', oauth.grant());

    // POST /oauth/authorise
    //
    // Verify user login and authorization access
    router.post('/authorise', this.authenticateUser, function(req, res, next){
      User
        .find({ where: { id: req.session.userId } })

        .error(function(err){
          res.render('oauth/authorise', req.body);
        })

        .success(function(user){
          if (!user) {
            return res.render('oauth/oauthorise', req.body);
          }

          req.user = user;
          next();
        })
    }, oauth.authCodeGrant(function(req, next) {
      next(null, req.body.allow === 'yes', req.session.userId, null);
    }));

    // GET /oauth/authorize
    //
    // Display user authorization and login form
    router.get('/authorise', this.authenticateUser ,function(req, res, next){
      res.render('oauth/authorise', {
        title: 'Authorise access',
        response_type: req.query.response_type,
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri
      });
    });

    return router;
  },

  authenticateUser: function(req, res, next){
    if (req.session.userId != null ){
      next();
    }else{
      res.redirect('/login');
    }
  }
}
