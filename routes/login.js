var router = require('express').Router(),
    sessionsController = require('../controllers/sessions_controller.js');


var db = require('../database/model'),
    User = db.User;

router.get('/login', sessionsController.new);

router.post('/login', sessionsController.create);

router.all('/logout', sessionsController.destroy);

module.exports = router;
