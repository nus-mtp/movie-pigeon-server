var server = require('../../server.js');
var request = require('supertest');
var should = require('should');
var user = require('../../models/user.js');

describe('User controller test', function () {
  before(function (done) {
    var password = user.getHashedPassword('pass');
    user.create({
      email: 'testemail',
      username: 'testusername',
      password: password
    })
      .then(function () {
        done();
      });
  });

  after(function (done) {
    user.destroy({
      where: {
        email: 'testemail'
      }
    })
      .then(function () {
        done();
      });
  });

  it('should add a user to the db', function (done) {
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('username=testname')
      .send('password=testpassword')
      .send('email=123@456.com')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('User Created');
        user.find({where: {username: 'testname'}}).then(function (users) {
          users.validPassword('testpassword').should.equal(true);
          users.destroy();
          done();
        });
      });
  });

  it('should report fail when duplicated user', function (done) {
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('username=testname')
      .send('password=testpassword')
      .send('email=testemail')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('User Existed');
        done();
      });
  });

  it('should not update username when auth fails', function (done) {
    request(server)
      .put('/api/users/username')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'wrongpass')
      .send('username=abcde')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(401);
        user.find({
          where: {
            email: 'testemail'
          }
        })
          .then(function (result) {
            result.username.should.equal('testusername');
            done();
          });
      });

  });

  it('should not update password when auth fails', function (done) {
    request(server)
      .put('/api/users/password')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'wrongpass')
      .send('password=pss')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(401);
        user.find({
          where: {
            email: 'testemail'
          }
        })
          .then(function (result) {
            result.password.should.equal(user.getHashedPassword('pass'));
            done();
          });
      });
  });

  it('should not update an empty username', function (done) {
    request(server)
      .put('/api/users/username')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'pass')
      .send('username=')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('No Username Provided');
        user.find({
          where: {
            email: 'testemail'
          }
        })
          .then(function (result) {
            result.username.should.equal('testusername');
            done();
          });
      });
  });

  it('should not update when username is same', function (done) {
    request(server)
      .put('/api/users/username')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'pass')
      .send('username=testusername')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Same Username');
        done();
      });
  });

  it('should not update an empty password', function (done) {
    request(server)
      .put('/api/users/password')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'pass')
      .send('passworde=')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('No Password Provided');
        user.find({
          where: {
            email: 'testemail'
          }
        })
          .then(function (result) {
            result.password.should.equal(user.getHashedPassword('pass'));
            done();
          });
      });
  });

  it('should not update when password is same', function (done) {
    request(server)
      .put('/api/users/password')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'pass')
      .send('password=pass')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Same Password');
        done();
      });
  });

  it('should update username', function (done) {
    request(server)
      .put('/api/users/username')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'pass')
      .send('username=newname')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('Username Updated');
        user.find({
          where: {
            email: 'testemail'
          }
        })
          .then(function (result) {
            result.username.should.equal('newname');
            done();
          });
      });
  });

  it('should update password', function (done) {
    request(server)
      .put('/api/users/password')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemail', 'pass')
      .send('password=newpassword')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('Password Updated');
        user.find({
          where: {
            email: 'testemail'
          }
        })
          .then(function (result) {
            result.password.should.equal(user.getHashedPassword('newpassword'));
            done();
          });
      });
  });
});
