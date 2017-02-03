var sequelize = require('./db.js')
var crypto = require('crypto')
var DataTypes = require('sequelize')

var User = sequelize.define('users', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
},
  {
    instanceMethods: {
      validPassword: function (password) {
        var shasum = crypto.createHash('sha1')
        shasum.update(password)
        password = shasum.digest('hex')
        return password === this.password
      }
    }
  }
)

module.exports = User
