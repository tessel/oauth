var db = require('../models/index');

db.Client
  .create({
    clientId: 'tessel-proxy-dev',
    clientSecret: 'the-tessel-devenv',
    clientSecretConfirmation: 'the-tessel-devenv',
    name: 'http://127.0.0.1:3000/login',
    grantTypeAllowed: 'https://tessel-grant',
    redirectUri: 'http://127.0.0.1:3000/oauth_redirect'
  })
  .success(function(client){
    console.log('client ====>', client);
  })
  .error(function(err){
    console.log('error ====>', err);
  })
