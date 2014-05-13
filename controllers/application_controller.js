var db = require('../models/index'),
    User = db.User;

var ApplicationController = {
  auth: function(req, res, next){
    var redirectToLogin = function(){
      req.session.originalUrl = req.originalUrl;
      req.session.user = null;
      req.session.userId = null;
      res.redirect('/login');
    }

    if (req.session.userId){
      if (req.session.user){
        next();
      }else{
        User
          .find({ where: { id: req.session.userId } })

          .success(function(user) {
            if (user) {
              req.session.user = user;
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
};

module.exports = ApplicationController;
