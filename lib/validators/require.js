'use strict';

let Validator = require('../validator');

class RequireValidator extends Validator {
  _getMessage() {
    return '请务必填写';
  }

  _validate(value) {
    if (value === 0 || value === false) return true;

    if (!value) return false;

    if (typeof value !== 'object') {
      return true;
    } else if ('length' in value) {
      return !!value.length;
    } else if ('size' in value) {
      return !!value.size;
    } else {
      return !!Object.keys(value).length;
    }
  }
}

module.exports = RequireValidator;
