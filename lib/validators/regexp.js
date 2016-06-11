const Validator = require('../validator');

class RegExpValidator extends Validator {
  _getDefaultMessage() {
    return '格式不正确';
  }

  _validate(value) {
    let {pattern} = this._config;
    let re = pattern;
    if (typeof pattern === 'string') {
      re = new RegExp(pattern);
    }
    return re.test(value);
  }
}

module.exports = RegExpValidator;
