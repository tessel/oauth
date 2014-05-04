var Scope = function(sequelize, DataTypes){
  return sequelize.define('Scope', {
    id: { type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true }
  });
};

module.exports = Scope;
