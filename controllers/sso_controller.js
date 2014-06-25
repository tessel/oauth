var discourse_sso = require('discourse-sso');
var SSOController = {};

function ssoGenerate(req, res, secret, redirectURL, callbackURL){
  var sso = new discourse_sso(secret);
  console.log("got query", req.query, req.query.sso);
  if(!sso.validate(req.query.sso, req.query.sig)) {
    // redirect back to original url
    console.log("could not validate, redirecting");
    return res.redirect(redirectURL);
  }

  var nonce = sso.getNonce(req.query.sso);
  req.session.nonce = nonce;
  req.session.sso_secret = secret;
  req.session.redirect = callbackURL;
  console.log("redirecting to main", req.session.redirect);
  return res.redirect('/');
}

SSOController.discourse = function (req, res){

  ssoGenerate(req, res, process.env.DISCOURSE_SSO_SECRET
    , process.env.DISCOURSE_REDIRECT, process.env.DISCOURSE_CALLBACK_URL);
}

SSOController.portal = function (req, res, next){
  ssoGenerate(req, res, process.env.PORTAL_SSO_SECRET
    , process.env.PORTAL_REDIRECT, process.env.PORTAL_CALLBACK_URL);
}

module.exports = SSOController;
