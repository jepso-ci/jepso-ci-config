var assert = require('assert');

module.exports = validate;
function validate(config) {
  assert(typeof config === 'object' && config, 'Config should be an object and not null');
  assert(typeof config.url === 'string' && config.url, 'Config.url should be a non-empty string');
  assert(config.url[0] === '/', 'Config.url should start with a `/` character');
  assert(config.url.length > 1, 'Config.url can\'t just be the `/` character');
  return config;
}