var router = require('express').Router();

module.exports = {
  all: function(oauth) {
    // GET /
    router.get('/', oauth.authorise(), function(req, res) {
      console.log('REQ.BODY =>', req.body);
      console.log('REQ.QUERY =>', req.query);
      res.render('index', { title: 'Express' });
    });

    // GET /register
    router.get('/register', function(req, res) {
      res.redirect('/users/new');
    });

    return router;
  }
}
