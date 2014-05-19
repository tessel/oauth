var Sequelize = require('sequelize'),
    dbConfig = require('../config/db')[process.env.NODE_ENV];

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

// define associations
db.AccessToken.belongsTo(db.User, { foreignKey: 'userId' });
db.AccessToken.belongsTo(db.Client, { foreignKey: 'clientId' });

db.User.hasMany(db.AccessToken, { foreignKey: 'userId' });
db.Client.hasMany(db.AccessToken, { foreignKey: 'clientId' });

module.exports = db;
