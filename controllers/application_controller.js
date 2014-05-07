var db = require('../models/index'),
    User = db.User;

var ApplicationController = function(){};

ApplicationController.prototype.auth = function(req, res, next){
  var redirectToLogin = function(){
    req.session.originalUrl = req.originalUrl;
    req.session.currentUser = null;
    req.session.userId = null;
    res.redirect('/login');
  }

  if (req.session.userId){
    if (req.session.currentUser){
      next();
    }else{
      User
        .find({ where: { id: req.session.userId } })

        .success(function(user) {
          if (user) {
            req.session.currentUser = user;
            next();
          }else {
            redirectToLogin();
          }
        })

        .error(function(err){
          console.log('Error ===>' , err);
          redirectToLogin();
        })
    }
  }else{
    redirectToLogin();
  }
}

module.exports = new ApplicationController();
