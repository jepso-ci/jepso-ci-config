var assert = require('assert');
var browsers = require('test-platforms');

var properties = [
  'url',
  'skip',
  'versions',
  'continueOnFail',
  'proxy'
];
var aliases = {
  'browsers': 'versions',
  'continueOnFailure': 'continueOnFail',
  'continue-on-failure': 'continueOnFail',
  'continue-on-fail': 'continueOnFail',
  'jproxy': 'proxy'
};

module.exports = validate;
function validate(config) {
  //config is an object
  assert(typeof config === 'object' && config, 'Config should be an object and not null');

  //aliases
  Object.keys(aliases)
    .forEach(function (key) {
      if (key in config) {
        config[aliases[key]] = config[key];
        delete config[key];
      }
    })
  Object.keys(config)
    .forEach(function (key) {
      assert(properties.indexOf(key) != -1, 'Unrecognized property, ' + JSON.stringify(key) + ', was found.');
    });

  //url is a sensible string
  assert(typeof config.url === 'string' && config.url, 'Config.url should be a non-empty string');
  assert(config.url[0] === '/', 'Config.url should start with a `/` character');
  assert(config.url.length > 1, 'Config.url can\'t just be the `/` character');



  if ('skip' in config) {
    validateVersions(config.skip, 'skip');
  }
  if ('versions' in config) {
    validateVersions(config.versions, 'versions');
  } else {
    assert(!config.continueOnFail, 'You can\'t use the "continueOnFail" option without also' + 
      ' providing an explicit list of browsers to run.');
  }
  if ('continueOnFail' in config) {
    assert(typeof config.continueOnFail === 'boolean', 'If present, Config.continueOnFail must be `true` or `false`');
  }

  return config;
}

function validateVersions(versions, name) {
  assert(typeof versions === 'object' && !Array.isArray(versions),
    'If present, Config.' + name + ' should be an object');
  Object.keys(versions)
    .forEach(function (browserName) {
      var lower = browserName.toLowerCase();
      if (lower !== browserName && !(lower in versions)) {
        versions[lower] = versions[browserName];
        delete versions[browserName];
      }
    });
  if (('ie' in versions) && !('internet explorer' in versions)) {
    versions['internet explorer'] = versions.ie;
    delete versions.ie;
  }
  Object.keys(versions)
    .forEach(function (browserName) {
      assert(Array.isArray(browsers[browserName]), JSON.stringify(browserName) + ' in ' + name + ' is not a valid browser name.');
      var realVersions = browsers[browserName].map(selectVersion);
      versions[browserName]
        .forEach(function (version) {
          assert(realVersions.indexOf(version) !== -1,
            JSON.stringify(browserName) + ' in ' + name + ' does not have a version ' + JSON.stringify(version));
        });
    });

}

function selectVersion(v) {
  return v.version;
}