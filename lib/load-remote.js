var Q = require('q');
var request = Q.nfbind(require('request'));
var lookup = require('./lookup');

module.exports = getConfig;
function getConfig(user, repo, tag, callback) {
  if (typeof tag === 'function') {
    callback = tag;
    tag = 'master';
  } else if (tag === undefined) {
    tag = 'master';
  }
  var id = user + '/' + repo + '/' + tag;
  function read(file) {
    return get('https://raw.github.com/' + id + '/' + file);
  }

  return lookup.async(read).nodeify(callback);
}

function get(url) {
  return request(url)
    .spread(function (res) {
      if (res.statusCode != 200) {
        var err = new Error('Could not load "' + url + '" server responded with status code ' + res.statusCode);
        err.statusCode = res.statusCode;
        err.transient = res.statusCode != 404;
        throw err;
      }
      return res.body.toString();
    });
}