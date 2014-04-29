var OauthAuthCode = function(sequelize, DataTypes){
  return sequelize.define('OauthAuthToken', {
    id: { type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true },
    authCode: { type: DataTypes.TEXT, unique: true, allowNull: false },
    clientId: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false }
  });
};

module.exports = OauthAuthCode;
