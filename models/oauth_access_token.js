var OauthAccessToken = function(sequelize, DataTypes){
  var OauthAccessTokenModel = sequelize.define('OauthAccessToken', {
    id: { type: DataTypes.UUID, primaryKey: true },
    accessToken: { type: DataTypes.TEXT, unique: true, allowNull: false },
    clientId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false }
  });

  return OauthAccessTokenModel;
};

module.exports = OauthAccessToken;
