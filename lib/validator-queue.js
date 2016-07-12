const error = require('./error');
const store = require('./store');
const Result = require('./result');

class ValidatorQueue {
  constructor(configs = []) {
    this._configs = configs;
    this._validators = [];
    this._require = true;
  }

  notRequire() {
    this._require = false;
    return this;
  }

  require(message) {
    this._require = true;
    if (message) {
      this._requireMsg = message;
    }
    return this;
  }

  transform(value) {
    this._initValidators();
    let transformed = value;
    for (const validator of this._validators) {
      try {
        transformed = validator.transform(value);
      } catch (e) {
        if (!(e instanceof error.TransformError)) {
          throw e;
        }
      }
    }
    return transformed;
  }

  validate(value, extraData) {
    this._initValidators();
    return this._validate(value, extraData);
  }

  _initValidators() {
    if (!this._validators.length) {
      this._validators = this._parseConfig(this._configs);
    }
  }

  _validate(value, extraData) {
    let result;
    for (const v of this._validators) {
      result = v.validate(value, extraData);
      if (!result.isValid) return result;
    }
    return result || new Result({value});
  }

  _parseConfig(configs) {
    const validators = [];
    const _configs = configs instanceof Array ? configs : [configs];

    let requireInConfig = false;
    for (const config of _configs) {
      if ('require' in config) {
        requireInConfig = true;
        validators.push(
          this._getValidator({
            type: 'require',
            message: config.message || this._requireMsg
          })
        );
      } else {
        validators.push(this._getValidator(config));
      }
    }

    if (!requireInConfig && this._require) {
      validators.unshift(
        this._getValidator({type: 'require', message: this._requireMsg})
      );
    }

    return validators;
  }

  _getValidator(config) {
    let ValidatorCls;
    if (config instanceof Function) {
      ValidatorCls = store.get('custom');
      config = {type: 'custom', validate: config};
    } else if (config && config.type) {
      ValidatorCls = store.get(config.type);
    } else {
      throw new TypeError('Validator.config must be a object or function');
    }
    if (!ValidatorCls) throw new TypeError(`${config.type} validator not registered`);
    return new ValidatorCls(config);
  }
}

module.exports = ValidatorQueue;
