var bcrypt = require('bcrypt'),
    crypto = require('crypto');

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
    resetExpire: {type: DataTypes.DATE},
    accessToken: { type: DataTypes.STRING, unique: true }
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
        } else if (this.accessToken != null) {
          this.passwordDigest = bcrypt.hashSync(this.accessToken, salt);          
        }

        return this;
      },

      genApiKey: function(){
        this.apiKey = crypto.randomBytes(16).toString('hex');
        return this;
      }
    },

  });
};

module.exports = User;
