var router = require('express').Router(),
    pagesController = require('../controllers/pages_controller.js');

module.exports = {
  all: function(oauth) {
    // GET /
    router.get('/', pagesController.index);

    // GET /register a new user
    router.get('/register', pagesController.register);

    return router;
  }
}
