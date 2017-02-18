var server = require('../../server.js');
var request = require('supertest');
var should = require('should');
var movie = require('../../models/movie.js');
var user = require('../../models/user.js');
var crypto = require('crypto');

var getObjects = function (obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) {
      continue;
    }
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));
    } else if (i === key && obj[i] === val || i === key && val === '') { //
      objects.push(obj);
    } else if (obj[i] === val && key === '') {
      if (objects.lastIndexOf(obj) === -1) {
        objects.push(obj);
      }
    }
  }
  return objects;
};

describe('Movie controller test', function () {
  before(function (done) {
    movie.bulkCreate([
      {movie_id: 'test000001', title: 'test1: here StUpId ABcdE'},
      {movie_id: 'test000002', title: 'test2: testmoviename LK'},
      {movie_id: 'test000003', title: 'test3: here'},
      {movie_id: 'test000004', title: 'test dummy movie1'},
      {movie_id: 'test000005', title: 'test dummy movie2'}
    ]).then(function () {
      var password = 'pass';
      var shasum = crypto.createHash('sha1');
      shasum.update(password);
      password = shasum.digest('hex');

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

  it('should get a movie from the db by its title', function (done) {
    request(server)
      .get('/api/movies/title')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .set('Title', 'test1')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        var data = res.body;
        data.length.should.equal(1);
        getObjects(data, 'movie_id', 'test000001').should.not.equal([]);
        done();
      });
  });

  it('should get multiple movie from the db by its title', function (done) {
    request(server)
      .get('/api/movies/title')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .set('Title', 'here')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        var data = res.body;
        data.length.should.equal(2);
        getObjects(data, 'movie_id', 'test000001').should.not.equal([]);
        getObjects(data, 'movie_id', 'test000003').should.not.equal([]);
        done();
      });
  });

  it('should get movie from the db by its title case insensitive',
    function (done) {
      request(server)
        .get('/api/movies/title')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth('testemailmovietest', 'pass')
        .set('Title', 'stupid')
        .expect(200)
        .end(function (err, res) {
          res.status.should.equal(200);
          var data = res.body;
          data.length.should.equal(1);
          getObjects(data, 'movie_id', 'test000001').should.not.equal([]);
          done();
        });
    });

  it('should get movie from the db by its title substring',
    function (done) {
      request(server)
        .get('/api/movies/title')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth('testemailmovietest', 'pass')
        .set('Title', 'moviename')
        .expect(200)
        .end(function (err, res) {
          res.status.should.equal(200);
          var data = res.body;
          data.length.should.equal(1);
          getObjects(data, 'movie_id', 'test000003').should.not.equal([]);
          done();
        });
    });

  it('should get movie from the db by its title, using limit and offset',
    function (done) {
      request(server)
        .get('/api/movies/title')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth('testemailmovietest', 'pass')
        .set('Title', 'test')
        .set('offset', '0')
        .set('limit', '3')
        .expect(200)
        .end(function (err, res) {
          res.status.should.equal(200);
          var data = res.body;
          data.length.should.equal(3);
          getObjects(data, 'movie_id', 'test000001').should.not.equal([]);
          getObjects(data, 'movie_id', 'test000002').should.not.equal([]);
          getObjects(data, 'movie_id', 'test000003').should.not.equal([]);
        });

      request(server)
        .get('/api/movies/title')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth('testemailmovietest', 'pass')
        .set('Title', 'test')
        .set('offset', '3')
        .set('limit', '3')
        .expect(200)
        .end(function (err, res) {
          res.status.should.equal(200);
          var data = res.body;
          data.length.should.equal(2);
          getObjects(data, 'movie_id', 'test000004').should.not.equal([]);
          getObjects(data, 'movie_id', 'test000005').should.not.equal([]);
          done();
        });
    });
});
