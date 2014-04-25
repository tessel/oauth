var db = require('../models/db'),
    model;

// Functions always required by node-oauth2-server
model.getAccessToken = function(accessToken, callback) {
  db.OauthAccessToken
    .find({ where: { accessToken: accessToken } })
    .success(function(token){
      if (token) {
        callback(null, {
          accessToken: token.accessToken,
          clientId: token.clientId,
          expires: token.expires,
          userId: token.userId
        });
      }else{
        callback(null, false)
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

model.getClient = function(clientId, clientSecret, callback) {
  db.OauthClient
    .find({ where: { clientId: clientId, clientSecret: clientSecret } })
    .success(function(client){
      if (client){
        callback(null, {
          clientId: client.client_id,
          clientSecret: client.client_secret
        });
      }else{
        callback(null, false);
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

model.grantTypeAllowed = function(clientId, grantType, callback) {
  db.OauthClient
    .find({ where: { clientId: clientId } })
    .success(function(client){
      var regex = new RegExp(grantType, 'i'),
          allowed = false;

      if ((client) && (client.grantTypeAllowed.search(regex) > -1)){
        allowed = true
      }else{
        allowed = false
      }

      callback(null, allowed);
    })
    .error(function(err){
      callback(err, false);
    });
};

model.saveAccessToken = function(accessToken, clientId, expires, userId, callback) {
  var newToken = db.OauthAccessToken.build({
    accesToken: accessToken,
    clientId: clientId,
    expires: expires,
    userId: userId
  });

  newToken
    .save()
    .success(function(persistedToken){
      callback(false);
    })
    .error(function(err){
      callback(err);
    })
};

// Required by GrantType authorization_code
model.getAuthCode = function(authCode, callback) {
  db.OauthAuthCode
    .find({ where: { authCode: authCode } })
    .success(function(code){
      if (code){
        callback(null, {
          authCode: code.authCode,
          clientId: code.clientId,
          userId: code.userId,
          expires: code.expires
        });
      }else{
        callback(null, false);
      }
    })
    .error(function(err){
        callback(err, false);
    });
};

model.saveAuthCode = function(authCode, clientId, expires, userId, callback){
  var newCode = db.OauthAuthCode.build({
    authCode: authCode,
    clientId: clientId,
    userId: userId,
    expires: expires,
  });

  newCode
    .save()
    .success(function(persistedCode){
      callback(false);
    })
    .err(function(err){
      callback(err);
    });
};

// Required by GrantType refresh_token
model.getRefreshToken = function(refreshToken, callback) {
  db.OauthRefreshToken
    .find({ where: { refreshToken: refreshToken } })
    .success(function(token){
      if (token){
        callback(null, {
          clientId:     token.clientId,
          refreshToken: token.refreshToken,
          expires:      token.expires
        });
      }else{
        callback(null, false);
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

model.saveRefreshToken = function(refreshToken, clientId, userId, expires, callback) {
  var newToken = db.OauthRefreshToken.build({
    refreshToken: refreshToken,
    clientId: clientId,
    userId: userId,
    expires: expires,
  });

  newToken
    .save()
    .success(function(persistedToken){
      callback(false);
    })
    .err(function(err){
      callback(err);
    });
};

// Required by GrantType password
model.getUser = function(username, password, callback) {
  db.User
    .find({ where: { username: username, password: password } })
    .success(function(user){
      if (user){
        callback(null, {
          id: user.id,
          username: user.username
        });
      }else{
        callback(null, false);
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

module.exports = model;
