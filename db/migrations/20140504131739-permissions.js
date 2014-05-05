module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('Permissions', {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },

      accessTokenId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      scopeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    done();
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('Permissions');
    done();
  }
}
