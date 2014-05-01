var db = require('../models/db');

db.User
  .build({
    username: 'johndoe',
    email: 'johndoe@tessel.io',
    name: 'John Doe',
    password: 'password',
    passwordConfirmation: 'password'
  })
  .confirmPassword()
  .digest()
  .genApiKey()
  .save()
  .success(function(user){
    console.log('user =>' + user.username + ' stored');
  })
  .error(function(err){
    console.log('error ====>', err);
  })

db.User
  .build({
    username: 'janedoe',
    email: 'janedoe@tessel.io',
    name: 'Jane Doe',
    password: 'password',
    passwordConfirmation: 'password'
  })
  .confirmPassword()
  .digest()
  .genApiKey()
  .save()
  .success(function(user){
    console.log('user =>' + user.username + ' stored');
  })
  .error(function(err){
    console.log('error ====>', err);
  })
