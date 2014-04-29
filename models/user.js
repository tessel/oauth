var User = function(sequelize, DataTypes){
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, validate: { notNull: true } },
    email: { type: DataTypes.STRING, unique: true, validate: { notNull: true } },
    name: { type: DataTypes.STRING },
    password_digest: { type: DataTypes.STRING, validate: { notNull: true } },
    api_key: { type: DataTypes.STRING, unique: true, validate: { notNull: true } }
  });
};

module.exports = User;
