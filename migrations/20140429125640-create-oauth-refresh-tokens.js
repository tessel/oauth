module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('OauthRefreshTokens', {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },

      refreshToken: {
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

    done();
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('OauthRefreshTokens');
    done();
  }
}