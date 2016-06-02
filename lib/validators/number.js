'use strict';

let Validator = require('../validator');

class InstanceValidator extends Validator {
  _validate(value) {
    return value instanceof this.config.type;
  }
}

class StringValidator extends InstanceValidator {
  _validate(value) {
  }
}

class NumberValidator extends InstanceValidator {
  _validate() {
    let pass = super.validate(value);
  }
}
