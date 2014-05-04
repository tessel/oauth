var Sequelize = require('sequelize'),
    dbConfig = require('../config/database')[process.env.NODE_ENV];

var sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  }
);

var db = {
  Sequelize: Sequelize,
  sequelize: sequelize
};

// import models
db['User'] = db.sequelize.import('../models/user');
db['Client'] = db.sequelize.import('../models/client');
db['AccessToken'] = db.sequelize.import('../models/access_token');
db['RefreshToken'] = db.sequelize.import('../models/refresh_token');
db['AuthCode'] = db.sequelize.import('../models/auth_code');

module.exports = db;
