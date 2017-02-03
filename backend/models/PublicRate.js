// Load required packages
var sequelize = require('./db.js');
var DataTypes = require('sequelize');
var RatingSource = require('./ratingSource.js');
var Movie = require('./movie.js');
// Define our public_rate schema
var Rates = sequelize.define('public_rates', {
  vote: {
    type: DataTypes.INTEGER
  }
});

RatingSource.belongsToMany(Movie, {
  through: Rates,
  foreignKey: 'source_id'
});
Movie.belongsToMany(RatingSource, {
  through: Rates,
  foreignKey: 'movie_id'
});

// Export the model
module.exports = Rates;
