var Sequelize = require('sequelize'),
    dbConfig = require('../config/db_config')[process.env.NODE_ENV];

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
db['User'] = db.sequelize.import('./user');
db['OauthClient'] = db.sequelize.import('./oauth_client');
db['OauthAccessToken'] = db.sequelize.import('./oauth_access_token');
db['OauthRefreshToken'] = db.sequelize.import('./oauth_refresh_token');
db['OauthAuthCode'] = db.sequelize.import('./oauth_auth_code');

module.exports = db;
