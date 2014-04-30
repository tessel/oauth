var db = require('../models/db');

db.OauthClient
  .build({
    clientId: 'thg',
    clientSecret: 'the-hybrid-group',
    name: 'http://www.hybridgroup.com',
    grantTypeAllowed: 'password|authorization_code|refresh_token',
  })
  .digest()
  .save()
  .success(function(client){
    console.log('client ====>', client);
  })
  .error(function(err){
    console.log('error ====>', err);
  })

db.OauthClient
  .build({
    clientId: 'tessel-cloud',
    clientSecret: 'the-tessel-cloud',
    name: 'http://www.tessel-cloud.io',
    grantTypeAllowed: 'password|authorization_code|refresh_token',
  })
  .digest()
  .save()
  .success(function(client){
    console.log('client ====>', client);
  })
  .error(function(err){
    console.log('error ====>', err);
  })
