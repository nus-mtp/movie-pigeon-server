var passport = require('passport')
var BasicStrategy = require('passport-http').BasicStrategy
var BearerStrategy = require('passport-http-bearer').Strategy
var User = require('../models/user')
var Client = require('../models/client')
var Token = require('../models/token')

passport.use('basic', new BasicStrategy(
  function (username, password, done) {
    User.find({where: {email: username}}).then(function (user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect email address.' })
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    })
  }
))

passport.use('client-basic', new BasicStrategy(
  function (username, password, callback) {
    Client.findOne({where: {id: username}}).then(function (client) {
      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false) }

      // Success
      return callback(null, client)
    })
  }
))

passport.use('bearer', new BearerStrategy(
  function (accessToken, callback) {
    Token.findOne({where: {value: accessToken}}).then(function (token) {
      // No token found
      if (!token) { return callback(null, false) }

      User.findOne({where: {id: token.userId}}).then(function (user) {
        // No user found
        if (!user) { return callback(null, false) }

        // Simple example with no scope
        callback(null, user, { scope: '*' })
      })
    })
  }
))

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false })
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false })
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false })
