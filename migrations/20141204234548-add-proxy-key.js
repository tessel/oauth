module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn(
      'Users', 
      'proxyKey', 
      {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      })
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('Users', 'proxyKey')
    done()
  }
}
