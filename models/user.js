var bcrypt = require('bcrypt');

var CLOUD_URI = process.env.CLOUD_URI;

var User = function(sequelize, DataTypes){
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING },
    passwordDigest: { type: DataTypes.STRING, allowNull: false },
    apiKey: { type: DataTypes.STRING, unique: true, allowNull: true },
    resetKey: { type: DataTypes.STRING, unique: true, allowNull: true, defaultValue: null},
    resetExpire: {type: DataTypes.DATE}
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
      passwordConfirmation: function(value){ this._passwordConfirmation = value; },
      reset: function(value) {
        this.resetKey = value;
        var tenMinLater = new Date();
        tenMinLater.setMinutes(tenMinLater.getMinutes() + 20);
        this.resetExpire = tenMinLater.toISOString();
      }
    },

    hooks: {
      beforeValidate: function(user, next){
        user.digest();
        next(null, user);
      },

      beforeCreate: function(user, next){
        user.genApiKey(null, user);
        next(null, user);
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
        var d = Date.now();
        var apikey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

        apikey = apikey.replace(/[xy]/g, function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
        });

        this.apiKey = apikey;

        return this;
      }
    },

  });
};

module.exports = User;
