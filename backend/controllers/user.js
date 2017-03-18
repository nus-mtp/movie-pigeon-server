var User = require('../proxy/user.js');
var UserModel = require('../models/user.js');

exports.postUser = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  User.getUserByEmail(email)
    .then(function (users) {
      if (users) {
        res.status(409).json({
          status: 'fail',
          message: 'User Existed'
        });
      } else {
        User.saveUser(email, username, password)
          .then(function () {
            res.status(200).json({
              status: 'success',
              message: 'User Created'
            });

          })
          .catch(function (err) {
            res.send(err);
          });
      }
    });
};

exports.getUser = function (req, res) {
  res.status(200).json({
    email: req.user.email,
    username: req.user.username
  });
};

exports.updateUsername = function (req, res) {
  var username = req.body.username;
  var user = req.user;

  if (username) {
    if (user.username === username) {
      res.status(409).json({
        status: 'fail',
        message: 'Same Username'
      });
    } else {
      User.updateUserUsername(user, username)
        .then(function () {
          res.status(200).json({
            status: 'success',
            message: 'Username Updated'
          });
        });
    }
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'No Username Provided'
    });
  }
};

exports.updatePassword = function (req, res) {
  var password = req.body.password;
  var user = req.user;

  if (password) {
    if (user.password === UserModel.getHashedPassword(password)) {
      res.status(409).json({
        status: 'fail',
        message: 'Same Password'
      });
    } else {
      User.updateUserPassword(user, password)
        .then(function () {
          res.status(200).json({
            status: 'success',
            message: 'Password Updated'
          });
        });
    }
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'No Password Provided'
    });
  }
};
