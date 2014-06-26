module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('Users', {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },

      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      name: {
        type: DataTypes.STRING
      },

      passwordDigest: {
        type: DataTypes.STRING,
        allowNull: false
      },

      apiKey: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      resetKey: {
        type: DataTypes.STRING,
        unique: true
      },

      resetExpire: {
        type: DataTypes.DATE
      },

      accessToken: {
        type: DataTypes.STRING
      },

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('Users')
    done()
  }
}
