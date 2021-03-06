var Movie = require('../models/movie.js');
var PublicRate = require('../models/PublicRate.js');
var RatingSource = require('../models/ratingSource.js');
var UserRating = require('../models/history.js');
var Bookmark = require('../models/bookmarks.js');
var sequelize = require('../models/db');
var Showing = require('../models/showing');
var Cinema = require('../models/cinema');

function getSearchString(searchString, priority) {
  searchString = searchString.trim();
  switch (priority) {
    case 1:
      return searchString;
      break;
    case 2:
      searchString += ' %';
      return searchString;
      break;
    case 3:
      searchString += '%';
      return searchString;
      break;
    case 4:
      searchString = '% ' + searchString + ' %';
      return searchString;
      break;
    case 5:
      searchString = '% ' + searchString;
      return searchString;
      break;
  }
}

exports.getMovieByTitleCount = function (searchString) {
  var rawString = searchString.trim();
  return Movie.count({
    where: {
      title: {
        $ilike: '%' + rawString + '%'
      }
    }
  })
};

exports.getMovieByTitle = function (userId, searchString, offset, limit) {

  var rawString = searchString.trim();
  return Movie.findAll({
    where: {
      title: {
        $ilike: '%' + rawString + '%'
      }
    },
    limit: limit,
    offset: offset,
    include: [
      {
        model: PublicRate,
        include: [
          RatingSource
        ]
      },
      {
        model: UserRating,
        where: {
          user_id: userId
        },
        required: false
      },
      {
        model: Bookmark,
        where: {
          user_id: userId
        },
        required: false
      },
      {
        model: Showing,
        required: false
      }
    ],
    order: [
      [sequelize.literal('CASE WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 1) + '\' THEN 0 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 2) + '\' THEN 1 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 3) + '\' THEN 2 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 4) + '\' THEN 3 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 5) + '\' THEN 4 ' +
        'ELSE 5  END, "movies"."production_year" DESC')]
    ]
  });
};

exports.getShowingMovieByTitle = function (userId, searchString) {

  var rawString = searchString.trim();
  return Movie.findAll({
    where: {
      title: {
        $ilike: '%' + rawString + '%'
      }
    },
    include: [
      {
        model: PublicRate,
        include: [
          RatingSource
        ]
      },
      {
        model: UserRating,
        where: {
          user_id: userId
        },
        required: false
      },
      {
        model: Bookmark,
        where: {
          user_id: userId
        },
        required: false
      },
      {
        model: Showing,
        include: [
          Cinema
        ],
        attributes: [],
        required: true
      }
    ],
    order: [
      [sequelize.literal('CASE WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 1) + '\' THEN 0 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 2) + '\' THEN 1 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 3) + '\' THEN 2 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 4) + '\' THEN 3 ' +
        'WHEN "movies"."title" ILIKE \'' + getSearchString(rawString, 5) + '\' THEN 4 ' +
        'ELSE 5  END, "movies"."production_year" DESC')]
    ]
  });
};

module.exports.getMovieById = function (movieId) {
  return Movie.find({
    where: {
      movie_id: movieId
    }
  })
};

exports.getMovieScheduleById = function (movieId) {
  return Showing.findAll({
      where: {
        movie_id: movieId
      },
      include: [
        Cinema
      ]
    })
};
