var bcrypt = require('bcrypt');

var OauthClient = function(sequelize, DataTypes){
  return sequelize.define('OauthClient', {
    clientId: { type: DataTypes.STRING, unique:true, allowNull: false, primaryKey: true },
    clientSecretDigest: { type: DataTypes.TEXT, allowNull: false },
    redirectUri: { type: DataTypes.TEXT },
    grantTypeAllowed: { type: DataTypes.STRING, allowNull: false }
  }, {
    validate: {
      clientSecret: function(next) {
        if ((this._clientSecret === undefined) || ((typeof(this._clientSecret) === 'string') && (this._clientSecret === this._clientSecretConfirmation))){
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
        var salt = bcrypt.genSaltSync(10);

        if ((this._clientSecret != null) && (typeof(this._clientSecret) === 'string') && (this._clientSecret === this._clientSecretConfirmation)){
          this.clientSecretDigest = bcrypt.hashSync(this._clientSecret, salt);
        }

        return this;
      }
    }
  });
};

module.exports = OauthClient;
