var router = require('express').Router();

var db = require('../database/model'),
    User = db.User;

// Validate user is logged in and exist in session
var authenticateUser = function(req, res, next){
  if (req.session.userId != null ){
    next();
  }else{
    res.redirect('/login');
  }
}
// GET /users/new
//
// Renders a form to create a new user
router.get('/new', function(req, res) {
  res.render('users/new', {
    title: 'Register new user',
    user: User.build(req.body.user)
  });
});

// POST /users
//
// Creates a new User
router.post('/', function(req, res) {
  var newUser = req.body.user;

  User
    .create(newUser)

    .error(function(err) {
      res.render('users/new', {
        title: 'Register new user',
        user: req.body.user
      });
    })

    .success(function(user) {
      req.session.userId = user.id;
      res.redirect('/users/show');
    });
});

// GET /users/show
//
// Shows details about the current user
router.get('/show', authenticateUser, function(req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  User
    .find({ where: { id: req.session.userId } })

    .error(function(err) {
       console.log("Error ==>", err);
       res.redirect('/login');
    })

    .success(function(user) {
      if (!user) {
        return res.redirect('/login');
      }

      res.render('users/show', {
        title: 'User Profile',
        user: user
      });
    });
});

module.exports = router;
