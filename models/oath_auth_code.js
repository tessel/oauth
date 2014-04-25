var OauthAuthCode = function(sequelize, DataTypes){
  var OauthRefreshTokenModel = sequelize.define('OauthRefreshToken', {
    id: { type: DataTypes.UUID, primaryKey: true },
    authCode: { type: DataTypes.TEXT, unique: true, allowNull: false },
    clientId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false }
  });

  return OauthRefreshTokenModel;
};

module.exports = OauthRefreshToken;
