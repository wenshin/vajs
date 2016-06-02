'use strict';

class Validator {
  constructor(config = {}) {
    this._config = config;
  }

  validate(value, extraData) {
    const transformed = this.transform(value);
    const isValid = this._validate(transformed, extraData);
    return {
      value,
      transformed,
      isValid: !!isValid,
      message: isValid ? '' : this._getMessage(this._config)
    };
  }

  /**
   * 私有方法，用于其他 Validator 继承时重写以实现所需的功能
   */
  _validate() {
    return true;
  }

  getMessage(config = {}) {
    let {message} = config;

    if (!message) {
      message = this._getMessage(this._config);
    } else if (message instanceof Function) {
      message = message(this._config);
    }

    return message;
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
