var Sequelize= require('sequelize'),
    sequelize= new Sequelize('tessel-cloud', 'edgar', 'tessel', {
      host: '127.0.0.1',
      port: 5432,
      dialect: 'postgres'
    }),
    db = {
      Sequelize: Sequelize,
      sequelize: sequelize
    };

// Require models
db['User'] = db.sequelize.import('./user');
db['OauthClient'] = db.sequelize.import('./oauth_client');
db['OauthAccessToken'] = db.sequelize.import('./oauth_access_token');
db['OauthRefreshToken'] = db.sequelize.import('./oauth_refresh_token');

module.exports = db;

