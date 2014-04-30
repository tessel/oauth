var express = require('express');
var router = express.Router();
var db = require('../models/db')

/* GET users listing. */
router.get('/new', function(req, res) {
  var user = db.User.build(req.body.user);
  res.render('users/new', {
    title: 'Register new user',
    user: user
  });
});

/* GET users listing. */
router.post('/', function(req, res) {
  var newUser = req.body.user;

  db.User
    .build(newUser)
    .confirmPassword(newUser)
    .digest()
    .genApiKey()
    .save()
    .success(function(user){
      res.render('users/show', {
        title: 'User profile',
        user: user
      });
    })
    .error(function(err){
      res.render('users/new' + user.id, {
        title: 'Register new user',
        user: req.body.user
      });
    });


});

module.exports = router;
