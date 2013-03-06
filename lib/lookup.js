var validate = require('./validate');


exports.async = async;
function async(read) {
  return read('.jepso-ci.json')
    .then(function (str) {
      return validate(JSON.parse(str));
    }, function (ex) {
      return read('package.json')
        .then(function (a) {
          a = selectJepsoCI(JSON.parse(a));
          if (a) return validate(a);
          else return readComponent();
        }, readComponent)
      function readComponent() {
        return read('component.json')
          .then(function (a) {
            a = selectJepsoCI(JSON.parse(a));
            if (a) return validate(a);
            else throw ex;
          }, function () {
            throw ex;
          })
      }
    });
}

exports.sync = sync;
function sync(read) {
  var str;
  try {
    str = read('.jepso-ci.json');
  } catch (ex) {
    var a, b;

    try {
      a = read('package.json');
    } catch (e) {
    }
    if (a) {
      a = selectJepsoCI(JSON.parse(a));
      if (a) return validate(a);
    }

    try {
      b = read('component.json');
    } catch (e) {
    }
    if (b) {
      b = selectJepsoCI(JSON.parse(b));
      if (b) return validate(b);
    }

    throw ex;
  }
  return validate(JSON.parse(str));
}

function selectJepsoCI(obj) {
  return obj && obj['jepso-ci'];
}