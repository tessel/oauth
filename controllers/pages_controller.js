var db = require('../models/index'),
    User = db.User;

var PagesController = function(){ };

PagesController.prototype.index = function(req, res, next){
  res.render('index', { title: 'Express' });
}

PagesController.prototype.register = function(req, res, next){
  res.redirect('/users/new');
}

module.exports = new PagesController();
