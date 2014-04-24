var OauthAccessToken = function(sequelize, DataTypes){
  var OauthAccessTokenModel = sequelize.define('OauthAccessToken', {
    id: { type: DataTypes.UUID, unique: true, primaryKey: true },
    accessToken: { type: DataTypes.TEXT, unique: true, allowNull: false },
    clientId: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false }
  });

  return OauthAccessTokenModel;
};

module.exports = User;
