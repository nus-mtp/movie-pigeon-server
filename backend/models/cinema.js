// Load required packages
var sequelize = require('./db.js');
var DataTypes = require("sequelize");
// Define our cinema schema
var Cinema = sequelize.define('cinemas', {
  cinema_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  cinema_name: {
    type: DataTypes.STRING
  }
});

// Export the model
module.exports = Cinema;
