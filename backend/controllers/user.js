var User = require('../models/user.js')
var crypto = require('crypto')

exports.postUser = function (req, res) {
  var username = req.body.username
  var password = req.body.password
  var email = req.body.email

  var user = User.build({ email: email, username: username, password: password })

  add(user, function (success) {
    res.json({ message: 'User created!' })
  },
  function (err) {
    res.send(err)
  })
}

exports.getUser = function (req, res) {
  retrieveAll(function (users) {
    if (users) {
      res.json(users)
    } else {
      res.send(401, 'User not found')
    }
  }, function (err) {
    res.send('User not found')
  })
}

var retrieveAll = function (onSuccess, onError) {
  User.findAll({}, {raw: true}).then(onSuccess).catch(onError)
}

exports.retrieveById = function (user_id, onSuccess, onError) {
  User.find({where: {id: user_id}}, {raw: true}).then(onSuccess).catch(onError)
}

var add = function (user, onSuccess, onError) {
  var password = user.password

  var shasum = crypto.createHash('sha1')
  shasum.update(password)
  password = shasum.digest('hex')

  User.build({ email: user.email, username: user.username, password: password })
      .save().then(onSuccess).catch(onError)
}

exports.updateById = function (user, user_id, onSuccess, onError) {
  var id = user_id
  var username = user.username
  var password = user.password

  var shasum = crypto.createHash('sha1')
  shasum.update(password)
  password = shasum.digest('hex')

  User.update({username: username, password: password}, {where: {id: id}})
    .then(onSuccess).catch(onError)
}

exports.removeById = function (user_id, onSuccess, onError) {
  User.destroy({where: {id: user_id}}).then(onSuccess).catch(onError)
}
