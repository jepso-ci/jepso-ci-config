var assert = require('assert');
require('mocha-as-promised')();
var join = require('path').join;
var conf = require('../');

describe('load remote', function () {
  it('loads the jepso-ci config of a repo', function () {
    this.timeout(10000);
    this.slow(2000);
    return conf.loadRemote('jepso-ci-examples', 'minimum', 'master')
      .then(function (res) {
        assert(conf.validate(res));
        assert(res.url === '/test.html');
      });
  });
  it('errors if the config can\'t be found', function () {
    this.timeout(10000);
    this.slow(2000);
    return conf.loadRemote('foo', 'bar', 'master')
      .then(function (res) {
        throw new Error('Should have failed');
      }, function (err) {
        return;
      });
  });
});

describe('load local', function () {
  it('loads the jepso-ci config of a directory', function () {
    this.timeout(2000);
    this.slow(200);
    return conf.loadLocal(join(__dirname, 'fixture'))
      .then(function (res) {
        assert(conf.validate(res));
        assert(res.url === '/test.html');
      });
  });
  it('loads the jepso-ci config of a directory syncronously', function () {
    this.timeout(2000);
    this.slow(200);
    var res = conf.loadLocal.sync(join(__dirname, 'fixture'))
    assert(conf.validate(res));
    assert(res.url === '/test.html');
  });

  it('errors if the config can\'t be found', function () {
    this.timeout(10000);
    this.slow(2000);
    return conf.loadLocal(join(__dirname, 'non-existant'))
      .then(function (res) {
        throw new Error('Should have failed');
      }, function (err) {
        return;
      });
  });
  it('errors if the config can\'t be found syncronously', function () {
    this.timeout(10000);
    this.slow(2000);
    try {
      conf.loadLocal.sync(join(__dirname, 'non-existant'))
    } catch (ex) {
      return;
    }
    throw new Error('Should have failed');
  });
});