var OauthRefreshToken = function(sequelize, DataTypes){
  var OauthRefreshTokenModel = sequelize.define('OauthRefreshToken', {
    id: { type: DataTypes.UUID, unique: true, primaryKey: true },
    refreshToken: { type: DataTypes.TEXT, unique: true, allowNull: false },
    clientId: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false }
  });

  return OauthRefreshTokenModel;
};

module.exports = OauthRefreshToken;
