const util = require('./util');

function Result(options) {
  if (!(this instanceof Result)) return new Result(options);

  const newOptions = options || {};
  const {
    value,
    transformed,
    isValid,
    message,
    promise
  } = newOptions;

  this.message = message || '';
  this.isValid = ('isValid' in newOptions) ? !!isValid : true;
  this.value = value;
  this.transformed = ('transformed' in newOptions) ? transformed : value;

  // async validation result
  if ('promise' in newOptions) {
    if (!util.isPromise(promise)) {
      throw new TypeError('vajs.Result promise option not a Promise instance');
    }
    this.pending = !!promise;
    this.promise = promise;
  }
}

module.exports = Result;
