var Mandrill = require('mandrill-api/mandrill')
  , nodemailer = require("nodemailer")
  , path = require('path')
  , fs = require('fs')
  , emailApp = require('express')()
  ;

emailApp.set('views', path.resolve(__dirname,'../emails'));

var mandrill = new Mandrill.Mandrill();

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Mandrill",
  auth: {
    user: process.env.MANDRILL_USERNAME,
    pass: process.env.MANDRILL_APIKEY
  }
});

exports.list = {
  recoverPassword: {
    subject: "Tessel Recover Password"
    , plain: String(fs.readFileSync(path.resolve(__dirname,'../emails/recoverPassword.txt')))
  }
} 

exports.sendMail = function(users, subject, plain, html, next){
  var count = 0;
  var errs = [];
  users.forEach(function(user, index){
    var message = {
      from: process.env.FROM_EMAIL
      , to: user.email
      , subject: subject
      , text: plain
      , html: html
    };

    smtpTransport.sendMail(message, function (err) {
      if (err) {
        errs.push(user.email)
        var err = "failed to send message to "+user.email;
        console.error(err);
      } else {
        console.log("sent to ", index, user.email);
      }

      count++;

      if (count >=users.length){
        errs = (errs.length == 0) ? null : errs;
        next(errs);
      }
    });
  });
}

// not really the best idea but whatever
exports.sendError = function(error, next){
  var message = {
    from: process.env.FROM_EMAIL
    , to: process.env.ERROR_EMAIL
    , subject: "Tessel Oauth Error"
    , text: "Hey you got an error\n\n"+error
    , html: "Hey you got an error\n\n"+error
  }

  console.log("email error", error)
  // smtpTransport.sendMail(message, function (err) {
  //   if (err) {
  //     // something about errors
  //     console.error("failed to send smtp", err);
  //   }
  //   next && next();
  // });
}