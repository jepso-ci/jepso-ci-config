[![Build Status](https://travis-ci.org/jepso-ci/jepso-ci-config.png?branch=master)](https://travis-ci.org/jepso-ci/jepso-ci-config)
[![Dependency Status](https://img.shields.io/david/jepso-ci/jepso-ci-config.svg)](https://david-dm.org/jepso-ci/jepso-ci-config)

# jepso-ci-config

API for interacting with jepso-ci config files

## Installation

    $ npm install jepso-ci-config

## API

### loadLocal(directory, [callback])

  Loads and validates/error-corrects jepso-ci configuration from a local directory.  If `callback` is omitted a promise is returned.

```javascript
var config = require('jepso-ci-config');
config.loadLocal(__dirname, function (err, res) {
  if (err) throw err;
  else console.dir(res);
});
```

### loadLocal.sync(directory)

  Loads and validates/error-corrects jepso-ci configuration from a local directory.

```javascript
var config = require('jepso-ci-config');
console.dir(config.loadLocal.sync(__dirname));
```

### loadRemote(user, repo, [tag = 'master'], [callback])

  Loads and validates/error-corrects jepso-ci configuration from a github repository.  If `callback` is omitted a promise is returned.

```javascript
var config = require('jepso-ci-config');
config.loadRemote('jepso-ci-examples', 'minimum', function (err, res) {
  if (err) throw err;
  else console.dir(res);
});
```

## License

  MIT