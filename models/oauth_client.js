var OauthClient = function(sequelize, DataTypes){
  var OauthAccessTokenModel = sequelize.define('OauthClient', {
    clientId: { type: DataTypes.STRING, unique:true, allowNull: false, primaryKey: true },
    clientSecret: { type: DataTypes.TEXT, allowNull: false },
    redirectUri: { type: DataTypes.TEXT },
    grantTypeAllowed: { type: DataTypes.STRING, allowNull: false }
  });

  return OauthAccessTokenModel;
};

module.exports = OauthClient;
