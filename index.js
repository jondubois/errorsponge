var cycle = require('cycle');

module.exports.ErrorSponge = ErrorSponge;

function ErrorSponge(options) {
  options = options || {};

  var unserializableList = options.unserializableErrorProperties || [];
  var len = unserializableList.length;

  this.unserializableErrorProperties = {};
  for (var i = 0; i < len; i++) {
    this.unserializableErrorProperties[unserializableList[i]] = true;
  }
}

ErrorSponge.prototype.dehydrate = function (error, includeStackTrace) {
  var dehydratedError;
  if (!error || typeof error == 'string') {
      dehydratedError = error;
  } else {
    dehydratedError = {
      message: error.message
    };
    if (includeStackTrace) {
      dehydratedError.stack = error.stack;
    }
    for (var i in error) {
      if (!this.unserializableErrorProperties[i]) {
        dehydratedError[i] = error[i];
      }
    }
  }
  return cycle.decycle(dehydratedError);
};

ErrorSponge.prototype.hydrate = function (error) {
  var hydratedError = null;
  if (error != null) {
    if (typeof error == 'string') {
      hydratedError = error;
    } else {
      hydratedError = new Error(error.message);
      for (var i in error) {
        if (error.hasOwnProperty(i)) {
          hydratedError[i] = error[i];
        }
      }
    }
  }
  return hydratedError;
};
