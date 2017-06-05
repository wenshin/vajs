const error = require('./error');
const Result = require('./result');
const MapResult = require('./map-result');
const util = require('./util');

class Validator {
  constructor(config = {}) {
    this.type = config.type;
    this._config = config;
  }

  validate(value, extraData) {
    let isTransformSucc = true;
    let transformed = value;

    try {
      transformed = this.transform(value);
    } catch (err) {
      if (err instanceof error.TransformError) {
        isTransformSucc = false;
      } else {
        throw err;
      }
    }

    if (isTransformSucc) {
      const result = this._validate(transformed, extraData);
      const resultData = {
        value,
        transformed,
        message: this.getMessage(this._config)
      };

      if (util.isPromise(result)) {
        return new Result({
          value,
          transformed,
          isValid: false, // before promise finished treat it as invalid
          promise: this._wrapPromise(result, resultData)
        });
      }
      return this._getResultOfValidation(result, resultData);
    }

    return new Result({
      value,
      transformed,
      isValid: isTransformSucc,
      message: isTransformSucc ? '' : this.getMessage(this._config)
    });
  }

  _wrapPromise(promise, resultData) {
    return promise
      .then(result => this._getResultOfValidation(result, resultData))
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
        throw new Error('custom type validate returned promise only allow to reject with a Error');
      });
  }

  _getResultOfValidation(result, resultData) {
    let newResult = result;
    // custom validation return boolean and `!result === false`
    if (!result || typeof result === 'boolean') {
      const isValid = !!result;
      newResult = new Result({
        isValid,
        value: resultData.value,
        transformed: resultData.transformed,
        message: isValid ? '' : resultData.message
      });
    // validation return Result or MapResult
    } else if (result instanceof Result || result instanceof MapResult) {
      newResult.message = result.isValid
        ? result.message
        : (result.message || resultData.message);
    // validation return object like {isValid, value}
    } else if (typeof result === 'object' && 'isValid' in result) {
      const isValid = result.isValid;
      newResult = new Result({
        isValid,
        value: resultData.value,
        transformed: resultData.transformed,
        message: isValid
          ? (result.message || '')
          : (result.message || resultData.message)
      });
    // custom validation return string, it will think `isValid === false`
    } else if (typeof result === 'string') {
      newResult = new Result({
        isValid: false,
        value: resultData.value,
        transformed: resultData.transformed,
        message: result
      });
    } else {
      newResult = new Result(resultData);
    }
    return newResult;
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
