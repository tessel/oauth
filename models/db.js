var Sequelize= require('sequelize');

var sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
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

module.exports = db;
