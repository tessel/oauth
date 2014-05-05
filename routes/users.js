var router = require('express').Router(),
    appController = require('../controllers/application.js'),
    usersController = require('../controllers/users_controller.js');

module.exports = {
  all: function(oauth){
    // GET /users/new
    //
    // Renders a form to create a new user
    router.get('/new', usersController.new );

    // POST /users
    //
    // Creates a new User
    router.post('/', usersController.create);

    router.get('/profiles/:id', oauth.authorise(), usersController.profile);

    // GET /users/show
    //
    // Shows details about the current user
    router.get('/:id', appController.authenticateUser, usersController.show);

    return router;
  },

}
