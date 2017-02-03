// Load required packages
var sequelize = require('./db.js')
var DataTypes = require('sequelize')
// Define our token schema
var Token = sequelize.define('token', {
  value: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING
  },
  clientId: {
    type: DataTypes.STRING
  }
})

// Export the Mongoose model
module.exports = Token
