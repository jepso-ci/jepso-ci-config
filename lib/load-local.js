var Q = require('q');
var fs = require('fs');
var join = require('path').join;
var lookup = require('./lookup');
var validate = require('./validate');

module.exports = getConfig;
function getConfig(directory, callback) {
  var readFile = Q.nfbind(fs.readFile);
  function read(file) {
    return readFile(join(directory, file))
      .then(function (res) {
        return res.toString();
      });
  }
  return lookup.async(read).nodeify(callback);
}

getConfig.sync = getConfigSync;
function getConfigSync(directory) {
  function read(file) {
    return fs.readFileSync(join(directory, file)).toString();
  }
  return lookup.sync(read);
}

function selectJepsoCI(obj) {
  return obj && obj['jepso-ci'];
}