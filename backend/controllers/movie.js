// Load required packages
var Movie = require('../proxy/movie.js');
var _ = require('underscore');
var dateFormat = require('dateformat');
// Create endpoint /api/movie for GET
exports.getMoviesByTitle = function (req, res) {
  // Use the Client model to find all clients
  Movie.getMovieByTitleCount(req.headers.title)
    .then(function (count) {
      Movie.getMovieByTitle(req.user.id, req.headers.title, req.headers.offset, req.headers.limit)
        .then(function (movies) {
          res.status(200).json({
            count: count,
            raw: movies
          });
        }).catch(function (err) {
          console.log(err);
        }
      );
    });
};

exports.getShowingMovieByTitle = function (req, res) {
  Movie.getShowingMovieByTitle(req.user.id, req.headers.title)
    .then(function (movies) {
      res.status(200).json(movies);
    }).catch(function (err) {
      console.log(err);
    }
  );
};

function parseSchedule(schedules) {
  for (var i in schedules) {
    schedules[i].dataValues.date = dateFormat(schedules[i].schedule, 'isoDate');
    schedules[i].dataValues.time = dateFormat(schedules[i].schedule, 'isoTime');
    schedules[i].dataValues.cinema_name = schedules[i].cinema.cinema_name;
    schedules[i].date = schedules[i].dataValues.date;
    schedules[i].time = schedules[i].dataValues.time;
    schedules[i].cinema_name = schedules[i].cinema.cinema_name;
    delete schedules[i].dataValues.cinema;
    delete schedules[i].dataValues.movie_id;
    delete schedules[i].dataValues.schedule;
  }
  return schedules;
}

function sortSchedule(schedules) {
  schedules = _.sortBy(schedules, 'type');
  schedules = _.sortBy(schedules, 'cinema_id');
  schedules = _.sortBy(schedules, 'date');
  for (var i in schedules) {
    delete schedules[i]['cinema']
  }
  return schedules;
}

exports.getMovieScheduleById = function (req, res) {
  Movie.getMovieScheduleById(req.headers.movie_id)
    .then(function (schedules) {
      schedules = parseSchedule(schedules);
      schedules = sortSchedule(schedules);
      res.status(200).json(schedules);
    }).catch(function (err) {
      console.log(err);
  })
};

// Create endpoint /api/movie for GET
exports.getMoviesById = function (req, res) {
  // Use the Client model to find all clients
  Movie.find({where: {id: req.headers.id}}).then(function (movies) {
    res.status(200).json(movies);
  }).catch(function (err) {
    res.send(err);
  });
};

// Create endpoint /api/movie for GET
exports.getMoviesByProductionYear = function (req, res) {
  // Use the Client model to find all clients
  Movie.find({where: {productionYear: req.headers.productionYear}})
    .then(function (movies) {
      res.status(200).json(movies);
    }).catch(function (err) {
    res.send(err);
  });
};
