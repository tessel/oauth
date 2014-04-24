var Sequelize= require('sequelize'),
    sequelize= new Sequelize('tessel-cloud', 'edgar', 'tessel', {
      host: '127.0.0.1',
      port: 5432,
      dialect: 'postgres'
    }),
    DB = {
      Sequelize: Sequelize,
      sequelize: sequelize
    };

// Require models
DB['User'] = DB.sequelize.import('./user');

module.exports = DB;
