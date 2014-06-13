var db = require('../models/index')
    , User = db.User
    , AccessToken = db.AccessToken
    , sessions = require('./sessions_controller.js')
    , email = require('../utils/email')
    , usersApp = require('express')()
    , path = require('path')
    , crypto = require('crypto')
    , Sequelize = require('sequelize')
    , fs = require('fs')
    ;

// change view directory to emails
usersApp.set('views', path.resolve(__dirname,'../emails'));
usersApp.set('view engine', 'jade');

var UsersController = {};

UsersController.new = function(req, res, next){
  res.render('users/new', {
    title: 'Register new user',
    user: User.build(req.body.user)
  });
};

UsersController.resetForm = function(req, res, next){
  var key = req.query.key;
  if (!key)
    return res.redirect('/login');

  return res.render("users/reset", {resetKey: key});
}

UsersController.reset = function(req, res, next){
  // find user with that reset key
  var key = req.query.key;
  console.log("param key", key);
  if (!key) {
    return res.redirect('/login');
  }

  var password = req.body.password;
  if (!password) {
    return res.render("users/reset", {resetKey: key, errors: ['password']});
  }

  console.log("new date", new Date());
  User
    .find({where: {resetKey: key, resetExpire: {
        gte: new Date().toISOString()
      }
    }})
    .success(function(user) {
      if (!user) {
        return res.render('users/reset', {failure: "This reset key has expired"});
      }

      user.password = password;
      user.passwordConfirmation = password;
      user.resetKey = null;

      user.digest()
        .save()
        .success(function(){
          console.log("success, setting session");
          req.session.userId = user.id;
          req.session.user = user;
          
          return res.redirect("/users/" + user.id);
        })
        .error(function(err){
          console.log("Error: user/reset", err);
          return res.render('users/reset', {ourfault: true});
        });
    })
    .error(function(err) {
      console.log("Error: user/reset", err);
      return res.render('users/reset', {errors: ['badRequest']})
    })
    ;
}

UsersController.resetPassword = function (req, res, next){
  // reset the user's password to a random string
  // sends an email via mandrill
  var username = req.body.username;
  if (!username) return res.send({errors: ['username']});

  User
    .find({where: 
      Sequelize.or({email: username }
        , {username: username}), limit: 1})
    .success(function(user) {
      console.log("got user", user);
      // generate secret key for password reset
      crypto.randomBytes(20, function(err, buf) {
        if (err) {
          // something is really wrong, we should email ourselves...
          email.sendError(err);
          return {errors: null, ourfault: true};
        } 

        var token = buf.toString('hex');
        
        var recoverURL = process.env.BASE_URL+'reset?key='+token;
        usersApp.render('recoverPassword', {user: user, link: recoverURL}, function(err, html){
          if (err) {
            email.sendError(err);
            return res.send({errors: null, ourfault: true});
          }

          var plainText = email.list.recoverPassword.plain;
          var subj = email.list.recoverPassword.subject;
           
          var re = new RegExp(/\[link\]/g);
          var updated_plain = plainText.replace(re, recoverURL);
          re = new RegExp(/\[username\]/g);
          updated_plain = updated_plain.replace(re, user.username);

          user.reset = token;
          user.save()
            .success(function(){
              email.sendMail([user], subj, updated_plain, html, function (err){
                if (err) {
                  email.sendError(err);
                  return res.send({errors: null, ourfault: true});
                } 
                // we're done                    
                return res.send({errors: null, sentEmail: true});
              });
            })
            .error(function(err){
              console.log("Error: user/resetPassword user.save", err);
              return res.send({errors: null, ourfault: true});
            });

        });
      });
    })
    .error(function (err) {
      // we're done
      return res.send({errors: null, sentEmail: true});
    })
    ;
}

UsersController.create = function(req, res, next){
  var newUser = req.body.user;

  User
    .create(newUser)
    .success(function(user) {
      sessions.signIn(req, res, user);
    })

    .error(function(err) {
      console.log('ERROR:', err);
      res.render('users/new', {
        title: 'Register new user',
        user: req.body.user
      });
    });
};

UsersController.profile = function(req, res, next){
  var accessToken = req.query.access_token || req.body.access_token;

  AccessToken
    .find({ where: { accessToken: accessToken }, include: [User] })

    .success(function(token){
      if (!token) return res.send(304, { error: { message: 'Invalid token.' } });

      var user = token.user;

      res.send({
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
        name: user.name
      });

    })

    .error(function(err){
      console.log('ERROR', err);
      res.send(500, err);
    });
};

UsersController.show = function(req, res, next){
  var errors = [],
      user = req.session.user;

  if (user.id != req.params.id) {
    req.params.id = user.id;
    errors.push({ message: 'You do not have sufficient permissions to access requested resource.' });
  }

  if (user){
    res.render('users/show', {
      title: 'User Profile',
      user: user,
      errors: errors
    });
  }else{
    return res.redirect('/login');
  }
};

UsersController.genApiKey = function(req, res, next) {
  var errors = [];

  if (req.session.user.id != req.params.id) {
    req.params.id = req.session.user.id;
    errors.push({ message: 'You do not have sufficient permissions to access requested resource.' });
  }

  User
    .find({ where: { id: req.session.user.id } })

    .success(function(user) {
      if (user){
        user
          .genApiKey()
          .save()
          .success(function() {
            req.session.user = user;
            res.redirect('/users/' + user.id);
          })
          .error(function() {
            errors.push({ message: 'An error occured while updating user profile.' });
            res.render('users/show', {
              title: 'User Profile',
              user: user,
              errors: errors
            });
          });
      }else{
        return res.redirect('/login');
      }
    })

    .error(function(err) {
      return res.redirect('/login');
    });
};

module.exports = UsersController;
