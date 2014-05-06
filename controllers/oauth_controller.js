var db = require('../models/index'),
    User = db.User;

var OauthController = function() { };

OauthController.prototype.createAuth = function(req, next) {
  // TODO? Check scopes allowed by the user and create corresponging
  // permissions records.
  next(null, req.body.allow === 'yes', req.session.currentUser.id);
}

OauthController.prototype.newAuth = function(req, res, next){
  res.render('oauth/authorise', {
    title: 'Authorise access',
    response_type: req.query.response_type,
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri
  });
}

module.exports = new OauthController();
