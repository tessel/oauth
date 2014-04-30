var bcrypt = require('bcrypt');

var User = function(sequelize, DataTypes){
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING },
    passwordDigest: { type: DataTypes.STRING, allowNull: false },
    apiKey: { type: DataTypes.STRING, unique: true, allowNull: true }
  }, {
    instanceMethods: {
      confirmPassword: function(user){
        if (user.password === user.passwordConfirmation){
          this.passwordDigest = user.password;
        }
        return this;
      },
      digest: function(){
        var salt = bcrypt.genSaltSync(10);
        this.passwordDigest = bcrypt.hashSync(this.passwordDigest, salt);
        return this;
      },
      genApiKey: function(){
        var salt = bcrypt.genSaltSync(5),
            apiKey = bcrypt.hashSync('' + Date.now() + '' + this.username + '' + Math.random(), salt);

        this.apiKey = new Buffer(apiKey).toString('base64');
        return this;
      }
    },

  });
};

module.exports = User;
