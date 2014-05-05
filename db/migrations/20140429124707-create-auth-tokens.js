module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('AuthTokens', {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },

      authCode: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false
      },

      clientId: {
        type: DataTypes.STRING,
        allowNull: false
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      expires: {
        type: DataTypes.DATE,
        allowNull: false
      },

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('AuthTokens');
    done()
  }
}
