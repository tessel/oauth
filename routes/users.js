var express = require('express'),
    router = express.Router(),
    db = require('../models/db');

/* GET New User form*/
router.get('/new', function(req, res) {
  var user = db.User.build(req.body.user);
  res.render('users/new', {
    title: 'Register new user',
    user: user
  });
});

/* POST Register New User */
router.post('/', function(req, res) {
  var newUser = req.body.user;

  db.User
    .build(newUser)
    .confirmPassword(newUser)
    .digest()
    .genApiKey()
    .save()
    .success(function(user){
      req.session.userId = user.id;
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

/* GET Show User Details */
router.get('/:id', function(req, res){
  db.User
    .find({ where: { id: req.session.user.id } })
    .success(function(user){
      if (user){
        res.render('users/show', {
          title: 'User profile',
          user: user
        });
      }else{
        res.render('login', {
          title: 'User Login',
          user: user
        });
      }
    })
    .error(function(err){
       console.log("ERROR ====>", err);
       res.render('login', {
          title: 'User Login',
       });
    });
});

module.exports = router;
