'use strict';

const error = require('./error');

class Validator {
  constructor(config = {}) {
    this._config = config;
  }

  validate(value, extraData) {
    let isValid = true;
    let transformed;

    try {
      transformed = this.transform(value);
    } catch (err) {
      if (err instanceof error.TransformError) {
        isValid = false;
      } else {
        throw err;
      }
    }

    isValid = isValid && this._validate(transformed, extraData);

    return {
      value,
      transformed,
      isValid: !!isValid,
      message: isValid ? '' : this.getMessage(this._config)
    };
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
