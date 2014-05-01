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
        if ((this._password === undefined) || ((typeof(this._password) === 'string') && (this._password === this._passwordConfirmation))){
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
    hooks:{
      beforeValidate: function(user, next){
        user.digest();
        user.genApiKey();
        next();
      }
    },
    instanceMethods: {
      digest: function(){
        var salt = bcrypt.genSaltSync(10);

        if ((this._password != null) && (typeof(this._password) === 'string') && (this._password === this._passwordConfirmation)){
          this.passwordDigest = bcrypt.hashSync(this._password, salt);
        }

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
