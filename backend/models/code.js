// Load required packages
var sequelize = require('./db.js');
var DataTypes = require("sequelize");

// Define our token schema
var Code  = sequelize.define('codes', {
  value: {
    type: DataTypes.STRING
  },
  redirectUri: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING,
  },
  clientId: {
    type: DataTypes.STRING
  }
});

// Export the Mongoose model
module.exports = Code;
