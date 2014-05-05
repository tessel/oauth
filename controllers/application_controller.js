var db = require('../db/model'),
    User = db.User;

var ApplicationController = function(){};

ApplicationController.prototype.authenticateUser = function(req, res, next){
  if (req.session.userId){
    if (req.session.currentUser){
      next();
    }else{
      User
        .find({ where: { id: req.session.userId } })

        .success(function(user){
          req.session.currentUser = user || null;
          next();
        })

        .error(function(err){
          console.log('Error ===>' , err);
          req.session.currentUser = null;
        })
    }
  }else{
    res.redirect('/login' + req._parsedUrl.search);
  }
}

module.exports = new ApplicationController();
