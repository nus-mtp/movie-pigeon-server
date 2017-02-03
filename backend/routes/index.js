var express = require('express')
var router = express.Router()
var userControl = require('../controllers/user.js')
var authController = require('../controllers/auth')
var oauth2Controller = require('../controllers/oauth2')
var clientController = require('../controllers/client')
var movieController = require('../controllers/movie')

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')
  .post(userControl.postUser)
  .get(authController.isAuthenticated, userControl.getUser)

/*
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

.put(authController.isAuthenticated, function(req, res) {
  var user = User.build();

  user.username = req.body.username;
  user.password = req.body.password;

  userControl.updateById(user, req.params.user_id, function(success) {
    console.log(success);
    if (success) {
      res.json({ message: 'User updated!' });
    } else {
      res.send(401, "User not found");
    }
    }, function(error) {
    res.send("User not found");
    });
})

.get(authController.isAuthenticated, function(req, res) {
  var user = User.build();

  userControl.retrieveById(req.params.user_id, function(users) {
    if (users) {
      res.json(users);
    } else {
      res.send(401, "User not found");
    }
  }, function(error) {
    res.send("User not found");
  });
})
*/
router.post('/users/login', authController.isAuthenticated, function (req, res) {
  return res.send('login successful')
})

// Create endpoint handlers for /clients
router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients)

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision)

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token)

router.route('/movies/id')
    .post(authController.isAuthenticated, movieController.getMoviesById)
router.route('/movies/title')
    .post(authController.isAuthenticated, movieController.getMoviesByTitle)
router.route('/movies/year')
    .post(authController.isAuthenticated, movieController.getMoviesByProductionYear)

module.exports = router
