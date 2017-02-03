// Load required packages
var sequelize = require('./db.js');
var DataTypes = require("sequelize");
var User = require('./user.js');
var Movie = require('./movie.js');
// Define our history schema
var history = sequelize.define('history', {
});

User.belongsToMany(Movie, {
  through: history,
  foreignKey: 'user_id'
});
Movie.belongsToMany(User, {
  through: history,
  foreignKey: 'movie_id'
});

// Export the model
module.exports = history;
