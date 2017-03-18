var server = require('../../server.js');
var request = require('supertest');
var should = require('should');
var movie = require('../../models/movie.js');
var user = require('../../models/user.js');
var rate = require('../../models/history.js');

describe('Rate controller test', function () {
  before(function (done) {
    movie.bulkCreate([
      {movie_id: 'test000001', title: 'test1: here StUpId ABcdE'},
      {movie_id: 'test000002', title: 'test2: testmoviename LK'},
      {movie_id: 'test000003', title: 'test3: here'},
      {movie_id: 'test000004', title: 'test dummy movie1'},
      {movie_id: 'test000005', title: 'test dummy movie2'}
    ]).then(function () {
      var password = user.getHashedPassword('pass');

      user.create({
        email: 'testemailmovietest',
        username: 'testusername',
        password: password
      }).then(function () {
        done();
      });
    });
  });

  after(function (done) {
    user.destroy({
      where: {
        email: 'testemailmovietest'
      }
    })
      .then(function () {
        movie.destroy({
          where: {
            movie_id: {$ilike: '%test%'}
          }
        })
          .then(function () {
            done();
          });
      });
  });

  it('should post a rate to the db', function (done) {
    request(server)
      .post('/api/ratings')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .send('score=4.5')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('Ratings Posted!');
        rate.find({
          where: {
            movie_id: 'test000001'
          }
        })
          .then(function (rating) {
            rating.score.should.equal(4.5);
            done();
          });
      });
  });

  it('should update a rate to the db', function (done) {
    request(server)
      .post('/api/ratings')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .send('score=7.9')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('Ratings Updated');
        rate.find({
          where: {
            movie_id: 'test000001'
          }
        })
          .then(function (rating) {
            rating.score.should.equal(7.9);
            done();
          });
      });
  });

  it('should report fail for score out of range', function (done) {
    request(server)
      .post('/api/ratings')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .send('score=-1')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Invalid Score');
      });

    request(server)
      .post('/api/ratings')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .send('score=10.3')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Invalid Score');
        done();
      });
  });

  it('should report fail when score is not float num', function (done) {
    request(server)
      .post('/api/ratings')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .send('score=abcde')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(400);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Invalid Score');
        done();
      });
  });

  it('should report fail when movieId is invalid', function (done) {
    request(server)
      .post('/api/ratings')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=randommovieId')
      .send('score=1.5')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(404);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Invalid MovieId');
        done();
      });
  });
});
