var OauthAccessToken = function(sequelize, DataTypes){
  return sequelize.define('OauthAccessToken', {
    id: { type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true },
    accessToken: { type: DataTypes.TEXT, unique: true, allowNull: false },
    clientId: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false }
  });
};

module.exports = OauthAccessToken;
