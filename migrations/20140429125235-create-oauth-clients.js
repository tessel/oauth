module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('OauthClients', {
      clientId: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
        primaryKey: true
      },

      clientSecret: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      redirectUri: DataTypes.TEXT,

      grantTypeAllowed: {
        type: DataTypes.STRING,
        allowNull: false
      },

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    done();
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('OauthClients');
    done();
  }
}