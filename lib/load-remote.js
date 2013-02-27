var Q = require('q');
var request = Q.nfbind(require('request'));
var validate = require('./validate');

module.exports = getConfig;
function getConfig(user, repo, tag) {
  var id = user + '/' + repo + '/' + tag;

  return get('https://raw.github.com/' + id + '/.jepso-ci.json')
    .then(validate)
    .fail(function (err) {
      if (err.statusCode !== 404) throw err;
      var pckg = get('https://raw.github.com/' + id + '/package.json').then(selectJepsoCI).then(validate);
      var cmpt = get('https://raw.github.com/' + id + '/component.json').then(selectJepsoCI).then(validate);
      return pckg
        .fail(function () {
          return cmpt;
        })
        .fail(function () {
          throw err;
        });
    });
}

function selectJepsoCI(obj) {
  return obj && obj['jepso-ci'];
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

      try {
        return JSON.parse(res.body.toString());
      } catch (ex) {
        var err = new Error('Failed to parse "' + url + '": ' + ex.message);
        err.name = ex.name;
        err.transient = false;
        throw err;
      }
    });
}