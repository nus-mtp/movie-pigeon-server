// Load required packages
var Movie = require('../models/movie.js')

// Create endpoint /api/movie for GET
exports.getMoviesByTitle = function (req, res) {
  // Use the Client model to find all clients
  Movie.findAll({where: {title: {$like: req.body.title}}}).then(function (movies) {
    res.json(movies)
  }).catch(function (err) {
    res.send(err)
  })
}

// Create endpoint /api/movie for GET
exports.getMoviesById = function (req, res) {
  // Use the Client model to find all clients
  Movie.find({where: {id: req.body.id}}).then(function (movies) {
    res.json(movies)
  }).catch(function (err) {
    res.send(err)
  })
}

// Create endpoint /api/movie for GET
exports.getMoviesByProductionYear = function (req, res) {
  // Use the Client model to find all clients
  Movie.find({where: {productionYear: req.body.productionYear}}).then(function (movies) {
    res.json(movies)
  }).catch(function (err) {
    res.send(err)
  })
}
