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
    validate: {
      password: function(next) {
        var pass = this._password,
            conf = this._passwordConfirmation;

        if ((pass === undefined) || ((pass != '') && (pass === conf))){
          next()
        } else {
          next('Password and password confirmation do not match!')
        }
      }
    },

    getterMethods: {
      password: function(){ return this._password },
      passwordConfirmation: function(){ return this._passwordConfirmation }
    },

    setterMethods: {
      password: function(value){ this._password = value; },
      passwordConfirmation: function(value){ this._passwordConfirmation = value; }
    },

    hooks: {
      beforeValidate: function(user, next){
        user.digest();
        user.genApiKey();
        next();
      }
    },

    instanceMethods: {
      digest: function(){
        var salt = bcrypt.genSaltSync(10),
            pass = this._password,
            conf = this._passwordConfirmation;

        if ((pass != null) && (pass != '') && (pass === conf)){
          this.passwordDigest = bcrypt.hashSync(this._password, salt);
        }

        return this;
      },

      genApiKey: function(){
        var salt = bcrypt.genSaltSync(5);

        var apiKey = bcrypt.hashSync(
          Date.now().toString() +
          this.username +
          Math.random().toString()
        , salt);

        this.apiKey = new Buffer(apiKey).toString('base64');

        return this;
      }
    },

  });
};

module.exports = User;
