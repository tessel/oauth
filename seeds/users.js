var db = require('../models/db');

db.User
  .build({
    username: 'johndoe',
    email: 'johndoe@tessel.io',
    name: 'John Doe',
    passwordDigest: 'password',
  })
  .digest()
  .genApiKey()
  .save()
  .success(function(user){
    console.log('user ====>', user);
  })
  .error(function(err){
    console.log('error ====>', err);
  })

db.User
  .build({
    username: 'janedoe',
    email: 'janedoe@tessel.io',
    name: 'Jane Doe',
    passwordDigest: 'password',
  })
  .digest()
  .genApiKey()
  .save()
  .success(function(user){
    console.log('user ====>', user);
  })
  .error(function(err){
    console.log('error ====>', err);
  })
