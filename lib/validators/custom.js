const Validator = require('../validator');

class CustomValidator extends Validator {
  _validate(value, extraData) {
    return this._config.validate(value, extraData);
  }
}

module.exports = CustomValidator;
