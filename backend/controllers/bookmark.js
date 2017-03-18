// Load required packages
var bookmarks = require('../proxy/bookmark.js');

// Create endpoint /api/ratings for POST
exports.postBookmarks = function (req, res) {
  var movieId = req.body.movieId;
  var userId = req.user.id;

  bookmarks.getSpecificBookmark(userId, movieId)
    .then(function (bookmarkResults) {
      if (bookmarkResults) {
        res.status(409).json({
          status: 'fail',
          message: 'Bookmark Existed'
        });
      } else {
        // Save the bookmark and check for errors
        bookmarks.postBookmark(movieId, userId)
          .then(function () {
            res.status(200).json({
              status: 'success',
              message: 'Bookmark Posted'
            });
          });
      }
    });
};

exports.deleteBookmarks = function (req, res) {
  var movieId = req.body.movieId;
  var userId = req.user.id;

  bookmarks.getSpecificBookmark(userId, movieId)
    .then(function (bookmarkResult) {
      if (bookmarkResult) {
        bookmarkResult.destroy()
          .then(function () {
            res.status(200).json({
              status: 'success',
              message: 'Bookmark Deleted'
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        res.status(404).json({
          status: 'fail',
          message: 'Bookmark Not Found'
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};

// Create endpoint /api/bookmarks for GET
exports.getBookmarks = function (req, res) {

  bookmarks.getAllBookmarks(req.user.id)
    .then(function (movies) {
      res.status(200).json(movies);
    });
};
