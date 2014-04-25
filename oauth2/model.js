var db = require('../models/db'),
    model;

// Functions always required by node-oauth2-server
model.getAccessToken = function (accessToken, callback) {
  db.OauthAccessToken
    .find({ where: { accessToken: accessToken } })
    .success(function(token){
      callback(null, {
        accessToken: token.accessToken,
        clientId: token.clientId,
        expires: token.expires,
        userId: token.userId
      });
    });
};

model.getClient = function (clientId, clientSecret, callback) {
  db.OauthClient
    .find({ where: { clientId: clientId, clientSecret: clientSecret } })
    .success(function(client){

      if (!clientSecret) return callback();

      callback(null, {
        clientId: client.client_id,
        clientSecret: client.client_secret
      });

    });
};

model.grantTypeAllowed = function (clientId, grantType, callback) {
  db.OauthClient
    .find({ where: { clientId: clientId } })
    .success(function(client){
      var regex = new RegExp(grantType, 'i'),
          allowed = false;

      if (client.grantTypeAllowed.search(regex) > -1){
        allowed = true
      }else{
        allowed = true
      }

      callback(null, allowed);

    });
};

model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {
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

// Required by GrantType RefreshToken
model.getRefreshToken = function (refreshToken, callback) {
  db.OauthRefreshToken
    .find({ where: { refreshToken: refreshToken } })
    .success(function(token){
      callback(null, {
        clientId:     token.clientId,
        refreshToken: token.refreshToken,
        expires:      token.expires
      });
    });
};

model.saveRefreshToken = function (refreshToken, clientId, userId, expires, callback) {
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

// Required by GrantType Password
model.getUser = function (username, password, callback) {
  db.User
    .find({ where: { username: username, password: password } })
    .success(function(user){
      callback(null, {
        id: user.id,
        username: user.username
      });
    });
};

module.exports = model;
