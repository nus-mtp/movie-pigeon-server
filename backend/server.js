var express = require('express')
var logger = require('morgan')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var uuid = require('uuid')
var passport = require('passport')
var ejs = require('ejs')
var path = require('path')

var app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.set('port', process.env.PORT || 8080)
app.use(logger('dev'))
app.use(cookieParser())
app.use(session({
  genid: function (req) {
    return uuid.v1()
  },
  secret: 'MoviePigeonXuanGeThePigeonist',
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// IMPORT ROUTES
// =============================================================================
var router = require('./routes/index.js')

// Middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening.')
  next()
})

app.use('/api', router)

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})

// for testing
module.exports = app
