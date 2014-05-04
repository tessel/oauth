module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('Scopes', {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },

      code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    });

    done()
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('Scopes');
    done();
  }
}
