var bcrypt = require('bcrypt');

var Client = function(sequelize, DataTypes){
  return sequelize.define('Client', {
    clientId: { type: DataTypes.STRING, unique:true, allowNull: false, primaryKey: true },
    clientSecretDigest: { type: DataTypes.TEXT, allowNull: false },
    redirectUri: { type: DataTypes.TEXT },
    grantTypeAllowed: { type: DataTypes.STRING, allowNull: false }
  }, {
    validate: {
      clientSecret: function(next) {
        var secret = this._clientSecret,
            confirm = this._clientSecretConfirmation;

        if ((secret === undefined) || ((secret != '') && (secret === confirm))){
          next();
        } else {
          next('Client secret and client secret confirmation do not match!');
        }
      }
    },
    getterMethods: {
      clientSecret: function(){ return this._clientSecret },
      clientSecretConfirmation: function(){ return this._clientSecretConfirmation }
    },
    setterMethods: {
      clientSecret: function(value){ this._clientSecret = value; },
      clientSecretConfirmation: function(value){ this._clientSecretConfirmation = value; }
    },
    hooks:{
      beforeValidate: function(client, next){
        client.digest();
        next();
      }
    },
    instanceMethods: {
      digest: function(){
        var salt = bcrypt.genSaltSync(10),
            secret = this._clientSecret,
            confirm = this._clientSecretConfirmation;

        if ((secret != null) && (secret != '') && (secret === confirm)){
          this.clientSecretDigest = bcrypt.hashSync(this._clientSecret, salt);
        }

        return this;
      }
    }
  });
};

module.exports = Client;
