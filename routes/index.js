var router = require('express').Router();

module.exports = {
  all: function(oauth) {
    // GET /
    router.get('/', oauth.authorise(), function(req, res) {
      res.render('index', { title: 'Express' });
    });

    // GET /register
    router.get('/register', function(req, res) {
      res.redirect('/users/new');
    });

    return router;
  }
}
