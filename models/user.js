var User = function(sequelize, DataTypes){
  var UserModel = sequelize.define('User', {
    id: { type: DataTypes.UUID, unique: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
  });

  return UserModel;
};

module.exports = User;
