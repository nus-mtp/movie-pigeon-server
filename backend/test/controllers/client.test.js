var server = require('../../server.js')
var request = require('supertest')
var should = require('should')
var client = require('../../models/client.js')
var user = require('../../models/user.js')
var crypto = require('crypto')

describe('Client controller test', function () {
  it('should add a client to the db', function (done) {
    var password = 'testpassword'
    var shasum = crypto.createHash('sha1')
    shasum.update(password)
    password = shasum.digest('hex')

    user.build({username: 'testname', password: password, email: 'testemail'}).save().then(function (user) {
      request(server)
        .post('/api/clients')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth('testemail', 'testpassword')
        .send('name=testclientname')
        .send('id=testclientid')
        .send('secret=testclientsecret')
        .expect(200)
        .end(function (err, res) {
          res.status.should.equal(200)
          res.body.message.should.equal('Client created!')
          client.find({where: {name: 'testclientname'}}).then(function (client) {
            client.secret.should.equal('testclientsecret')
            client.destroy()
            user.destroy()
          })
          done()
        })
    })
  })

  it('should require authentication to add client', function (done) {
    user.build({username: 'testname', password: 'testpassword', email: 'testemail'}).save().then(function (user) {
      request(server)
        .post('/api/clients')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('name=testclientname')
        .send('id=testclientid')
        .send('secret=testclientsecret')
        .expect(401)
        .end(function (err, res) {
          res.status.should.equal(401)
          user.destroy()
          done()
        })
    })
  })

  it('should require correct username and password to add client', function (done) {
    user.build({username: 'testname', password: 'testpassword', email: 'testemail'}).save().then(function (user) {
      request(server)
        .post('/api/clients')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth('testname', 'wrongpassword')
        .send('name=testclientname')
        .send('id=testclientid')
        .send('secret=testclientsecret')
        .expect(401)
        .end(function (err, res) {
          res.status.should.equal(401)
          user.destroy()
          done()
        })
    })
  })
})
