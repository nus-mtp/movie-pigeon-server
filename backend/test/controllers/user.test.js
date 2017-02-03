var server = require('../../server.js')
var request = require('supertest')
var should = require('should')
var user = require('../../models/user.js')

describe('User controller test', function () {
  it('should add a user to the db', function (done) {
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('username=testname')
      .send('password=testpassword'``)
      .send('email=song@test.com')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200)
        res.body.message.should.equal('User created!')
        user.find({where: {username: 'testname'}}).then(function (users) {
          users.validPassword('testpassword').should.equal(true)
          users.destroy()
        })
        done()
      })
  })
})
