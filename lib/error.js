'use strict';

function TransformError(validator, value) {
  var tmp = new Error();
  tmp.name = this.name = 'TransformError';
  tmp.message = this.message = `${validator} transform ${value} fail!`;

  Object.defineProperty(this, 'stack', {
    get: function () {
      return tmp.stack
    }
  });

  return this;
}

TransformError.prototype = Error.prototype;

module.exports = {
  TransformError
};
