var discourse_sso = require('discourse-sso');

exports.cleanUser = function(nonce, user, secret){
  // console.log("user", user);
  var userParams = {
    "nonce": nonce
    , "external_id": user.email
    , "email": user.email
    , "username": user.username
    , "name": user.name
  }

  var sso = new discourse_sso(secret);
  return sso.buildLoginString(userParams);
}