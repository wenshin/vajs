const error = require('./error');
const Result = require('./result');

class Validator {
  constructor(config = {}) {
    this._config = config;
  }

  validate(value, extraData) {
    let isValid = true;
    let transformed = value;

    try {
      transformed = this.transform(value);
    } catch (err) {
      if (err instanceof error.TransformError) {
        isValid = false;
      } else {
        throw err;
      }
    }

    if (isValid) {
      const result = this._validate(transformed, extraData);
      if (result instanceof Result) {
        result.message = result.isValid ? '' : (result.message || this.getMessage(this._config));
        return result;
      } else {
        isValid = !!result;
      }
    }

    return new Result({
      value,
      transformed,
      isValid: !!isValid,
      message: isValid ? '' : this.getMessage(this._config)
    });
  }

  /**
   * 私有方法，用于其他 Validator 继承时重写以实现验证
   */
  _validate() {
    return true;
  }

  getMessage(config) {
    let {message} = config || this._config;

    if (!message) {
      message = this._getDefaultMessage(config);
    } else if (message instanceof Function) {
      message = message(config);
    }

    return message;
  }

  /**
   * 私有方法，用于其他 Validator 继承时重写以实现验证失败信息
   * @param {Object} config validator config
   */
  _getDefaultMessage() {
    return '验证失败';
  }

  /**
   * 类型转换方法，用于把原始值转换成指定类型的值
   * @param  {Any} value 原始值
   * @return {Any}
   */
  transform(value) {
    return value;
  }
}

module.exports = Validator;
