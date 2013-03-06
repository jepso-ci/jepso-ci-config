var assert = require('assert');
require('mocha-as-promised')();
var lookup = require('../lib/lookup');
var Q = require('q');
var sinon = require('sinon');

describe('lookup', function () {
  function spec(name, wrap, reject) {
    var method = lookup[name];
    describe(name, function () {
      describe('when there is a ".jepso-ci.json" file', function () {
        describe('when it is valid', function () {
          it('returns the json object', function () {
            var read = sinon.stub();
            read.withArgs('.jepso-ci.json').returns(wrap('{"url": "/foo.html"}'));
            return Q(method(read))
              .then(function (res) {
                assert(res && typeof res === 'object');
                assert(res.url === '/foo.html');
              })
          });
        });
        describe('when it is not valid JSON', function () {
          it('throws the error from JSON.parse', function () {
            var read = sinon.stub();
            read.withArgs('.jepso-ci.json').returns(wrap('{"url": "/foo.html"'));
            read.withArgs('package.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}}'));
            return Q(null)
              .then(function () {
                return method(read);
              })
              .then(function () {
                throw new Error('should throw an error');
              }, function (err) {
                assert(err instanceof SyntaxError);
              })
          });
        });
        describe('when it is not a valid jepso-ci config', function () {
          it('throws the error from validation', function () {
            var read = sinon.stub();
            read.withArgs('.jepso-ci.json').returns(wrap('{"url": "foo.html"}'));
            read.withArgs('package.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}}'));
            return Q(null)
              .then(function () {
                return method(read);
              })
              .then(function () {
                throw new Error('should throw an error');
              }, function (err) {
                assert(err.name === 'AssertionError');
              })
          });
        });
      });
      describe('when there is not a ".jepso-ci.json" file', function () {
        describe('when there is a "package.json" file', function () {
          describe('when it has a valid "jepso-ci" property', function () {
            it('returns the json object pointed to by "jepso-ci"', function () {
              var read = sinon.stub();
              reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
              read.withArgs('package.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}}'));
              read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "/bar.html"}}'));
              return Q(method(read))
                .then(function (res) {
                  assert(res && typeof res === 'object');
                  assert(res.url === '/foo.html');
                })
            });
          });
          describe('when it is not valid JSON', function () {
            it('throws the error from JSON.parse', function () {
              var read = sinon.stub();
              reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
              read.withArgs('package.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}'));
              read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "/bar.html"}}'));
              return Q(null)
                .then(function () {
                  return method(read);
                })
                .then(function () {
                  throw new Error('should throw an error');
                }, function (err) {
                  assert(err instanceof SyntaxError);
                })
            });
          });
          describe('when it is not a valid jepso-ci config', function () {
            it('throws the error from validation', function () {
              var read = sinon.stub();
              reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
              read.withArgs('package.json').returns(wrap('{"jepso-ci": {"url": "foo.html"}}'));
              read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "/bar.html"}}'));
              return Q(null)
                .then(function () {
                  return method(read);
                })
                .then(function () {
                  throw new Error('should throw an error');
                }, function (err) {
                  assert(err.name === 'AssertionError');
                })
            });
          });
          describe('when it does not have a "jepso-ci" property', function () {
            it('falls through to component.json', function () {
              var read = sinon.stub();
              reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
              read.withArgs('package.json').returns(wrap('{}'));
              read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}}'));
              return Q(method(read))
                .then(function (res) {
                  assert(res && typeof res === 'object');
                  assert(res.url === '/foo.html');
                })
            });
          });
        });
        describe('when there is not a "package.json" file (with a "jepso-ci" property)', function () {
          describe('when there is a "component.json" file', function () {
            describe('when it has a valid "jepso-ci" property', function () {
              it('returns the json object pointed to by "jepso-ci"', function () {
                var read = sinon.stub();
                reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
                reject(read.withArgs('package.json'), new Error('file not found'));
                read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}}'));
                return Q(method(read))
                  .then(function (res) {
                    assert(res && typeof res === 'object');
                    assert(res.url === '/foo.html');
                  })
              });
            });
            describe('when it is not valid JSON', function () {
              it('throws the error from JSON.parse', function () {
                var read = sinon.stub();
                reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
                reject(read.withArgs('package.json'), new Error('file not found'));
                read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}'));
                return Q(null)
                  .then(function () {
                    return method(read);
                  })
                  .then(function () {
                    throw new Error('should throw an error');
                  }, function (err) {
                    assert(err instanceof SyntaxError);
                  })
              });
            });
            describe('when it is not a valid jepso-ci config', function () {
              it('throws the error from validation', function () {
                var read = sinon.stub();
                reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
                reject(read.withArgs('package.json'), new Error('file not found'));
                read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "foo.html"}}'));
                return Q(null)
                  .then(function () {
                    return method(read);
                  })
                  .then(function () {
                    throw new Error('should throw an error');
                  }, function (err) {
                    assert(err.name === 'AssertionError');
                  })
              });
            });
            describe('when it does not have a "jepso-ci" property', function () {
              it('falls through to component.json', function () {
                var read = sinon.stub();
                var jepsoErr = new Error('".jepso-ci.json" not found');
                reject(read.withArgs('.jepso-ci.json'), jepsoErr);
                reject(read.withArgs('package.json'), new Error('file not found'));
                read.withArgs('component.json').returns(wrap('{}'));
                return Q(null)
                  .then(function () {
                    return method(read);
                  })
                  .then(function () {
                    throw new Error('method should throw an exception');
                  }, function (err) {
                    assert(err === jepsoErr)
                  })
              });
            });
          });
          describe('when there is no "component.json" file', function () {
            it('throws the file not found error for ".jepso-ci.json"', function () {
              var read = sinon.stub();
              var jepsoErr = new Error('".jepso-ci.json" not found');
              reject(read.withArgs('.jepso-ci.json'), jepsoErr);
              reject(read.withArgs('package.json'), new Error('file not found'));
              reject(read.withArgs('component.json'), new Error('file not found'));
              return Q(null)
                .then(function () {
                  return method(read);
                })
                .then(function () {
                  throw new Error('method should throw an exception');
                }, function (err) {
                  assert(err === jepsoErr)
                })
            });
          });
        })
        describe('when is a valid "jepso-ci" property in "component.json"', function () {
          it('returns the json object pointed to by "jepso-ci"', function () {
            var read = sinon.stub();
            reject(read.withArgs('.jepso-ci.json'), new Error('file not found'));
            reject(read.withArgs('package.json'), new Error('file not found'));
            read.withArgs('component.json').returns(wrap('{"jepso-ci": {"url": "/foo.html"}}'));
            return Q(method(read))
              .then(function (res) {
                assert(res && typeof res === 'object');
                assert(res.url === '/foo.html');
              })
          });
        });
      });
    });
  }
  spec('sync', function (res) {
    return res;
  }, function (stub, err) {
    stub.throws(err);
  });
  spec('async', function (res) {
    return Q(res);
  }, function (stub, err) {
    stub.returns(Q.reject(err));
  });
});
