var bcrypt = require('bcrypt');

var OauthClient = function(sequelize, DataTypes){
  return sequelize.define('OauthClient', {
    clientId: { type: DataTypes.STRING, unique:true, allowNull: false, primaryKey: true },
    clientSecret: { type: DataTypes.TEXT, allowNull: false },
    redirectUri: { type: DataTypes.TEXT },
    grantTypeAllowed: { type: DataTypes.STRING, allowNull: false }
  }, {
    instanceMethods: {
      digest: function(){
        var salt = bcrypt.genSaltSync(10);
        this.clientSecret = bcrypt.hashSync(this.clientSecret, salt);
        return this;
      }
    }
  });
};

module.exports = OauthClient;
