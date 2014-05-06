var bcrypt = require('bcrypt'),
    rest = require('restler');

var CLOUD_URI = process.env.CLOUD_URI;

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
      },

      // POSTs the User ID and API Key to Cloud so they can be used to control
      // Tessels
      afterCreate: function(user, next) {
        var uri = CLOUD_URI + "/users",
            data = { id: user.id, apiKey: user.apiKey };

        rest.postJson(uri, data);
        next();
      },
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
      },

      updateCloud: function() {
        var uri = CLOUD_URI + "/users/" + this.id,
            data = function() { apiKey: this.apiKey };

        rest.putJson(uri, data);
      }
    },

  });
};

module.exports = User;
