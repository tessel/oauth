var express = require('express');
var router = express.Router();
var db = require('../models/db')

/* GET users listing. */
router.get('/', function(req, res) {
  db.User.findAll()
    .success(function(users){
      res.render('users/index', {
        title: 'User Listing',
        users: users
      });
    });
});

module.exports = router;
