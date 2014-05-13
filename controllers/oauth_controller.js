var db = require('../models/index'),
    User = db.User;

var OauthController = {};

OauthController.createAuth = function(req, next) {
  // TODO? Check scopes allowed by the user and create corresponging
  // permissions records.
  next(null, req.body.allow === 'yes', req.session.user.id);
};

OauthController.newAuth = function(req, res, next){
  res.render('oauth/authorise', {
    title: 'Authorise access',
    response_type: req.query.response_type,
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri
  });
};

module.exports = OauthController;
