var OauthRefreshToken = function(sequelize, DataTypes){
  return sequelize.define('OauthRefreshToken', {
    id: { type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true },
    refreshToken: { type: DataTypes.TEXT, unique: true, allowNull: false },
    clientId: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false }
  });
};

module.exports = OauthRefreshToken;
