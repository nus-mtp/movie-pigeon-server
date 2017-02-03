// Load required packages
var sequelize = require('./db.js')
var DataTypes = require('sequelize')
// Define our ratingsource schema
var RatingSource = sequelize.define('ratingsources', {
  source_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  source_name: {
    type: DataTypes.STRING
  }
})

// Export the model
module.exports = RatingSource
