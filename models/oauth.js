var db = require('../db/model'),
    bcrypt = require('bcrypt'),
    model = {};

// Functions always required by node-oauth2-server
model.getAccessToken = function(accessToken, callback) {
  db.AccessToken
    .find({ where: { accessToken: accessToken } })
    .success(function(token){
      if (token) {
        callback(null, token);
      }else{
        callback(null, false)
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

model.getClient = function(clientId, clientSecret, callback) {
  db.Client
    .find({ where: { clientId: clientId } })
    .success(function(client){
      if (client && clientSecret && !bcrypt.compareSync(clientSecret, client.clientSecretDigest)){
        callback(null, false);
      }else{
        callback(null, client);
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

model.grantTypeAllowed = function(clientId, grantType, callback) {
  db.Client
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

model.saveAccessToken = function(accessToken, clientId, expires, user, callback) {
  db.AccessToken
    .create({
      accessToken: accessToken,
      clientId: clientId,
      userId: user.id,
      expires: expires
    })
    .success(function(persistedToken){
      callback(false);
    })
    .error(function(err){
      callback(err);
    })
};

// Required by GrantType authorization_code
model.getAuthCode = function(authCode, callback) {
  db.AuthCode
    .find({ where: { authCode: authCode } })
    .success(function(code){
      if (code){
        callback(null, code);
      }else{
        callback(null, false);
      }
    })
    .error(function(err){
        callback(err, false);
    });
};

model.saveAuthCode = function(authCode, clientId, expires, userId, callback){
  db.AuthCode
    .create({
      authCode: authCode,
      clientId: clientId,
      userId: userId,
      expires: expires,
    })
    .success(function(persistedCode){
      callback(false);
    })
    .error(function(err){
      callback(err);
    });
};

// Required by GrantType refresh_token
model.getRefreshToken = function(refreshToken, callback) {
  db.RefreshToken
    .find({ where: { refreshToken: refreshToken } })
    .success(function(token){
      if (token){
        callback(null, token);
      }else{
        callback(null, false);
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

model.saveRefreshToken = function(refreshToken, clientId, expires, user, callback) {
  db.RefreshToken
    .create({
      refreshToken: refreshToken,
      clientId: clientId,
      userId: user.id,
      expires: expires,
    })
    .success(function(persistedToken){
      callback(false);
    })
    .error(function(err){
      callback(err);
    });
};

// Required by GrantType password
model.getUser = function(username, password, callback) {
  db.User
    .find({ where: { username: username } })
    .success(function(user){
      if (user && bcrypt.compareSync(password, user.passwordDigest)){
        callback(null, user);
      }else{
        callback(null, false);
      }
    })
    .error(function(err){
      callback(err, false);
    });
};

module.exports = model;
