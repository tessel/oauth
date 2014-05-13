var db = require('../models/index'),
    User = db.User;

var PagesController = {};

PagesController.index = function(req, res, next){
  res.render('index', { title: 'Express' });
}

PagesController.register = function(req, res, next){
  res.redirect('/users/new');
}

module.exports = PagesController;
