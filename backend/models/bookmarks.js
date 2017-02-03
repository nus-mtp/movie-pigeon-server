// Load required packages
var sequelize = require('./db.js');
var DataTypes = require("sequelize");
var User = require('./user.js');
var Movie = require('./movie.js');
// Define our bookmark schema
var Bookmark = sequelize.define('bookmarks', {
});

User.belongsToMany(Movie, {
  through: Bookmark,
  foreignKey: 'user_id'
});
Movie.belongsToMany(User, {
  through: Bookmark,
  foreignKey: 'movie_id'
});

sequelize.sync({});

// Export the model
module.exports = Bookmark;
