var db = require('../database/model');

db.User
  .create({
    username: 'johndoe',
    email: 'johndoe@tessel.io',
    name: 'John Doe',
    password: 'password',
    passwordConfirmation: 'password'
  })
  .success(function(user){
    console.log('user =>' + user.username + ' stored');
  })
  .error(function(err){
    console.log('error ====>', err);
  });

db.User
  .create({
    username: 'janedoe',
    email: 'janedoe@tessel.io',
    name: 'Jane Doe',
    password: 'password',
    passwordConfirmation: 'password'
  })
  .success(function(user){
    console.log('user =>' + user.username + ' stored');
  })
  .error(function(err){
    console.log('error ====>', err);
  });
