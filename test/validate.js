var assert = require('assert');
require('mocha-as-promised')();
var conf = require('../');

describe('validate', function () {
  describe('overall checks', function () {
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
    it('fails if conf has unrecognized properties', function () {
      assert.throws(function () {
        conf.validate({url: '/foo.html', foo: 'bar'});
      }, Error);
    });
  });
  describe('url', function () {
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
  });
  describe('versions', function () {
    describe('when valid', function () {
      it('passes', function () {
        conf.validate({url: '/foo.html', versions: {opera: ['12']}})
      });
    });
    describe('when upper case', function () {
      it('gets fixed', function () {
        assert(conf.validate({url: '/foo.html', versions: {Opera: ['12']}}).versions.opera[0] === '12');
      });
    });
    describe('when "ie"', function () {
      it('becomes "internet explorer"', function () {
        assert(conf.validate({url: '/foo.html', versions: {ie: ['9']}}).versions['internet explorer'][0] === '9');
      });
    });
    describe('when not an object', function () {
      it('fails', function () {
        assert.throws(function () {
          conf.validate({url: '/foo.html', versions: ['opera']});
        }, Error);
      });
    });
    describe('when a browser doesn\'t exist', function () {
      it('fails', function () {
        assert.throws(function () {
          conf.validate({url: '/foo.html', versions: {oper: ['12']}});
        }, Error);
      });
    });
    describe('when a browser version doesn\'t exist', function () {
      it('fails', function () {
        assert.throws(function () {
          conf.validate({url: '/foo.html', versions: {opera: ['1']}});
        }, Error);
      });
    });
    describe('when aliased as "browsers"', function () {
      it('works as normal', function () {
        var res = conf.validate({url: '/foo.html', browsers: {opera: ['12']}});
        assert(res.versions.opera[0] === '12');
      });
    });
  });
  describe('skip', function () {
    describe('when valid', function () {
      it('passes', function () {
        conf.validate({url: '/foo.html', skip: {opera: ['12']}})
      });
    });
    describe('when not an object', function () {
      it('fails', function () {
        assert.throws(function () {
          conf.validate({url: '/foo.html', skip: ['opera']});
        }, Error);
      });
    });
    describe('when a browser doesn\'t exist', function () {
      it('fails', function () {
        assert.throws(function () {
          conf.validate({url: '/foo.html', skip: {oper: ['12']}});
        }, Error);
      });
    });
    describe('when a browser version doesn\'t exist', function () {
      it('fails', function () {
        assert.throws(function () {
          conf.validate({url: '/foo.html', skip: {opera: ['1']}});
        }, Error);
      });
    });
  });
  describe('when successful', function () {
    it('passes through the configuration', function () {
      var A = {url: '/foo.html'};
      assert(A === conf.validate(A));
    });
  });
});