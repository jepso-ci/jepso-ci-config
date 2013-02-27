var assert = require('assert');
require('mocha-as-promised')();
var conf = require('../');

describe('validate', function () {
  it('fails if conf is null or not an object', function () {
    assert.throws(function () {
      conf.validate(null);
    }, Error);
    assert.throws(function () {
      conf.validate(true);
    }, Error);
    assert.throws(function () {
      conf.validate(false);
    }, Error);
    assert.throws(function () {
      conf.validate(function () {});
    }, Error);
    assert.throws(function () {
      conf.validate(5);
    }, Error);
    assert.throws(function () {
      conf.validate(undefined);
    }, Error);
    assert.throws(function () {
      conf.validate('foo');
    }, Error);
  });
  it('fails if url is null or an empty string', function () {
    assert.throws(function () {
      conf.validate({url: null});
    }, Error);
    assert.throws(function () {
      conf.validate({url: true});
    }, Error);
    assert.throws(function () {
      conf.validate({url: ''});
    }, Error);
  });
  it('fails if url does not start with a `/`', function () {
    assert.throws(function () {
      conf.validate({url: 'a'});
    }, Error);
    assert.throws(function () {
      conf.validate({url: '1'});
    }, Error);
    assert.throws(function () {
      conf.validate({url: ':'});
    }, Error);
  });
  it('fails if url is just a `/`', function () {
    assert.throws(function () {
      conf.validate({url: '/'});
    }, Error);
  });
  it('passes if url is a `/` followed by a file path', function () {
    conf.validate({url: '/foo.html'});
  });
  it('passes through the configuration when successful', function () {
    var A = {url: '/foo.html'};
    assert(A === conf.validate(A));
  });
});

describe('load remote', function () {
  it('loads the contents of a .jepso-ci.json file from a repo', function () {
    return conf.loadRemote('jepso-ci-examples', 'minimum', 'master')
      .then(function (res) {
        assert(conf.validate(res));
        assert(res.url === '/test.html');
      });
  });
});