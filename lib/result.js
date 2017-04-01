const util = require('./util');

function Result(options) {
  if (!(this instanceof Result)) return new Result(options);

  const {
    value,
    transformed,
    isValid,
    message,
    results,
    promise
  } = options || {};

  this.isValid = ('isValid' in options) ? !!isValid : true;
  this.message = message || '';

  if ('results' in options) {
    // vajs.ValidateMap results
    this.results = results;
    this.value = util.createMapProxy(this.results, 'value');
    this.transformed = util.createMapProxy(this.results, 'transformed');
  } else {
    this.value = value;
    this.transformed = ('transformed' in options) ? transformed : value;
  }

  // async validation result
  if ('promise' in options) {
    if (!util.isPromise(promise)) {
      throw new TypeError('vajs.Result promise option not a Promise instance');
    }
    this.pending = !!promise;
    this.promise = promise;
  }
}

module.exports = Result;
