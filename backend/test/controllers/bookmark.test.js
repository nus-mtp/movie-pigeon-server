var server = require('../../server.js');
var request = require('supertest');
var should = require('should');
var movie = require('../../models/movie.js');
var user = require('../../models/user.js');
var bookmark = require('../../models/bookmarks.js');

function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) {
      continue;
    }
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));
    } else
    if (i === key && obj[i] === val || i === key && val === '') { //
      objects.push(obj);
    } else if (obj[i] === val && key === ''){
      if (objects.lastIndexOf(obj) === -1){
        objects.push(obj);
      }
    }
  }
  return objects;
}

describe('Bookmark controller test', function () {
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

  it('should post a bookmark to the db', function (done) {
    request(server)
      .post('/api/bookmarks')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('Bookmark Posted');
        bookmark.find({
          where: {
            movie_id: 'test000001'
          }
        })
          .then(function (bookmarks) {
            bookmarks.should.not.equal(undefined);
            done();
          });
      });
  });

  it('should report fail when bookmark existed', function (done) {
    request(server)
      .post('/api/bookmarks')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(409);
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Bookmark Existed');
        done();
      });
  });

  it('should get all bookmarks from the db', function (done) {
    request(server)
      .get('/api/bookmarks')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        var data = res.body;
        data.length.should.equal(1);
        getObjects(data, 'movie_id', 'test000001').should.not.equal([]);
        done();
      });
  });

  it('should report fail when delete a empty bookmark from the db',
    function (done) {
      request(server)
        .delete('/api/bookmarks')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .auth('testemailmovietest', 'pass')
        .send('movieId=test000003')
        .expect(200)
        .end(function (err, res) {
          res.status.should.equal(404);
          res.body.status.should.equal('fail');
          res.body.message.should.equal('Bookmark Not Found');
          done();
        });
    });

  it('should delete a bookmark from the db', function (done) {
    request(server)
      .delete('/api/bookmarks')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .auth('testemailmovietest', 'pass')
      .send('movieId=test000001')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        res.body.message.should.equal('Bookmark Deleted');
        bookmark.find({
          where: {
            movie_id: 'test000001'
          }
        })
          .then(function (bookmarks) {
            (bookmarks === null).should.equal(true);
            done();
          });
      });
  });

});
