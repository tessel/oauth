var OauthClient = function(sequelize, DataTypes){
  var OauthAccessTokenModel = sequelize.define('OauthClient', {
    id: { type: DataTypes.UUID, unique: true, primaryKey: true },
    clientId: { type: DataTypes.TEXT, unique:true, allowNull: false },
    clientSecret: { type: DataTypes.TEXT, allowNull: false },
    redirectURI: { type: DataTypes.TEXT, allowNull: false },
  });

  return OauthAccessTokenModel;
};

module.exports = OauthClient;
