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
    // here do not use `RegExp.prototype.test()`,
    // because of it using `RegExp.prototype.exec()` internal,
    // if the expression have a global flag,
    // the `RegExp.prototype.exec()`` will cache state which is like
    // ```
    // re = /\w+/g;
    // re.test('1');
    // > true
    // re.test('1');
    // > false
    // ```
    return value && value.match && value.match(re);
  }
}

module.exports = RegExpValidator;
