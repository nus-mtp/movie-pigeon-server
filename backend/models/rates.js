// Load required packages
var sequelize = require('./db.js');
var DataTypes = require('sequelize');
var User = require('./user.js');
var Movie = require('./movie.js');
// Define our rate schema
var Rates = sequelize.define('rates', {
  rating: {
    type: DataTypes.FLOAT
  }
});

User.belongsToMany(Movie, {
  through: Rates,
  foreignKey: 'user_id'
});
Movie.belongsToMany(User, {
  through: Rates,
  foreignKey: 'movie_id'
});


// Export the model
module.exports = Rates;
