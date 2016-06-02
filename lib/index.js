'use strict';

class Validator {
  constructor(config) {
    this._config = config;
    this.message = config.message || this.defaultMessage;
  }

  validate(value, extraData) {
    const transformed = this.transform(value);
    const isValid = this._validate(transformed, extraData);
    return {
      value,
      transformed,
      isValid: !!isValid,
      message: isValid ? '' : this._getMessage()
    };
  }

  /**
   * 私有方法，用于其他 Validator 继承时重写以实现所需的功能
   */
  _validate() {
    return true;
  }

  getMessage() {
    let {message} = this._config;

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

class RequireValidator extends Validator {
  _getMessage() {
    return '请务必填写';
  }

  _validate(value) {
    if (value === 0) return true;

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

/**
 * 保存支持的验证器
 */
const localValidatorMap = new Map();

function register(type, ValidatorCls) {
  localValidatorMap.set(type, ValidatorCls);
}

register('require', RequireValidator);
register(String, StringValidator);
register(Number, NumberValidator);
register('pattern', NumberValidator);
register('instanceof', InstanceValidator);
register('email', NumberValidator);
register('url', NumberValidator);


class ValiidatorQueue {
  constructor(configs = []) {
    this._configs = configs;
    this._validators = [];
    this._require = true;
  }

  noRequire() {
    this._require = false;
  }

  _parseConfig(configs) {
    let validators = [];
    let _configs = configs instanceof Array ? configs : [configs];

    this._require && _configs.unshift({type: 'require'});

    for (let config of _configs) {
      validators.push(this._getValidator(config));
    }

    return validators;
  }

  _getValidator(config) {
    const ValidatorCls = localValidatorMap.get(config.type);
    if (!ValidatorCls) throw new TypeError(`${config.type} validator not registered`);
    return new ValidatorCls(config);
  }

  validate(value, extraData) {
    if (!this._validators.length) {
      this._validators = this._parseConfig(this._configs);
    }
    const result = this._validate(value, extraData);
    return result;
  }

  _validate(value, extraData) {
    let result;
    for (let v of this._validators) {
      result = v.validate(value, extraData);
      if (!result.isValid) return result;
    }
    return result;
  }
}

module.exports = {
  v: configs => new ValiidatorQueue(configs),
  register
}
