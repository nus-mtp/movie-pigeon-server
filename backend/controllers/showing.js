var showing = require('../proxy/showing.js');

exports.getShowingByCinema = function (req, res) {
  showing.getShowingByCinema(req.user.id, req.headers.cinema_id)
    .then(function (result) {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          status: 'fail',
          message: 'No Schedule For Cinema'
        });
      }
    })
};

exports.getAllShowingMovie = function (req, res) {
  showing.getAllShowingMovie(req.user.id)
    .then(function (result) {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          status: 'fail',
          message: 'No Schedule For Cinema'
        });
      }
    })
};
