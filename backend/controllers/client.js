// Load required packages
var Client = require('../models/client.js')

// Create endpoint /api/client for POST
exports.postClients = function (req, res) {
  var name = req.body.name
  var id = req.body.id
  var secret = req.body.secret
  var userId = req.user.email
  // Save the client and check for errors
  Client.build({ name: name, id: id, secret: secret, userId: userId })
      .save().then(function (success) {
        res.json({ message: 'Client created!' })
      })
}

// Create endpoint /api/clients for GET
exports.getClients = function (req, res) {
  // Use the Client model to find all clients
  Client.find({ userId: req.user._id }, function (err, clients) {
    if (err) {
      return res.send(err)
    }
    res.json(clients)
  })
}
