// Load required packages
var Movie = require('../models/movie.js');
var PublicRate = require('../models/PublicRate.js');
// Create endpoint /api/movie for GET
exports.getMoviesByTitle = function (req, res) {
  // Use the Client model to find all clients
  Movie.findAll({
    where: {
      title: {$like: req.headers.title}
    },
    include: [
      PublicRate
    ]
  })
    .then(function (movies) {
      res.json(movies);
    }).catch(function (err) {
      res.send(err);
    }
  );
};

// Create endpoint /api/movie for GET
exports.getMoviesById = function (req, res) {
  // Use the Client model to find all clients
  Movie.find({where: {id: req.headers.id}}).then(function (movies) {
    res.json(movies);
  }).catch(function (err) {
    res.send(err);
  });
};

// Create endpoint /api/movie for GET
exports.getMoviesByProductionYear = function (req, res) {
  // Use the Client model to find all clients
  Movie.find({where: {productionYear: req.headers.productionYear}})
    .then(function (movies) {
      res.json(movies);
    }).catch(function (err) {
    res.send(err);
  });
};
