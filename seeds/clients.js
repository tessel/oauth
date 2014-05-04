var db = require('../models/db');

db.Client
  .create({
    clientId: 'thg',
    clientSecret: 'the-hybrid-group',
    clientSecretConfirmation: 'the-hybrid-group',
    name: 'http://www.hybridgroup.com',
    grantTypeAllowed: 'password|authorization_code|refresh_token',
    redirectUri: 'http://hybridgroup.com'
  })
  .success(function(client){
    console.log('client ====>', client);
  })
  .error(function(err){
    console.log('error ====>', err);
  })

db.Client
  .create({
    clientId: 'tessel-cloud',
    clientSecret: 'the-tessel-cloud',
    clientSecretConfirmation: 'the-tessel-cloud',
    name: 'http://www.tessel-cloud.io',
    grantTypeAllowed: 'password|authorization_code|refresh_token',
    redirectUri: 'http://tessel.io'
  })
  .success(function(client){
    console.log('client ====>', client);
  })
  .error(function(err){
    console.log('error ====>', err);
  })
