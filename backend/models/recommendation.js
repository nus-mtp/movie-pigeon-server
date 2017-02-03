// Load required packages
var sequelize = require('./db.js')
var DataTypes = require('sequelize')
var User = require('./user.js')
var Movie = require('./movie.js')
// Define our recommendation schema
var Recommendation = sequelize.define('recommendations', {
  scoring: {
    type: DataTypes.FLOAT
  }
})

User.belongsToMany(Movie, {
  through: Recommendation,
  foreignKey: 'user_id'
})
Movie.belongsToMany(User, {
  through: Recommendation,
  foreignKey: 'movie_id'
})

// Export the model
module.exports = Recommendation
