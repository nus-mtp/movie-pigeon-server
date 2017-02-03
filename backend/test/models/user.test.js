var supertest = require('supertest')
var should = require('should')
var User = require('../../models/user.js')

describe('User Model test', function () {
  it('should compare hashed password', function (done) {
    var user = User.build({username: 'test', password: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'})
    user.validPassword('anyhow').should.equal(false)
    user.validPassword('test').should.equal(true)
    done()
  })
})
