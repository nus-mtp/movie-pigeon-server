var sequelize = require('./db.js');
var crypto = require('crypto');
var DataTypes = require("sequelize");

var client = sequelize.define('clients', {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
},
{
  instanceMethods: {
    validPassword: function(password) {
      var shasum = crypto.createHash('sha1');
      shasum.update(password);
      password = shasum.digest('hex');
      return password == this.password;
    }
  }
}
);

module.exports = client;
