// Load required packages
var rate = require('../proxy/rate.js');
var movie = require('../proxy/movie.js');

// Create endpoint /api/ratings for POST
exports.postRates = function (req, res) {
  var movieId = req.body.movieId;
  var score = parseFloat(req.body.score) || -1;
  var userId = req.user.id;

  if (score < 0 || score > 10) {
    res.status(400).json({status: 'fail', message: 'Invalid Score'});
    return;
  }

  movie.getMovieById(movieId)
    .then(function (movie) {
      if (movie) {
        rate.getSpecificRate(userId, movieId)
          .then(function (ratings) {
            if (ratings) {
              rate.updateRates(ratings, score)
                .then(function () {
                  return res.status(200).json({
                    status: 'success',
                    message: 'Ratings Updated'
                  });
                });
            } else {
              // Save the rating and check for errors
              rate.postRates(score, movieId, userId)
                .then(function () {
                  res.status(200).json({
                    status: 'success',
                    message: 'Ratings Posted!'
                  });
                });
            }
          });
      } else {
        res.status(404).json({
          status: 'fail',
          message: 'Invalid MovieId'
        });
      }
    });
};

// Create endpoint /api/ratings for GET
exports.getRates = function (req, res) {
  rate.getAllRates(req.user.id)
    .then(function (movies) {
      res.json(movies);
    });
};
