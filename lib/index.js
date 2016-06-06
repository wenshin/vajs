'use strict';

var store = require('./store');
var ValidatorMap = require('./validator-map');

class ValidatorQueue {
  constructor(configs = []) {
    this._configs = configs;
    this._validators = [];
    this._require = true;
  }

  noRequire() {
    this._require = false;
    return this;
  }

  validate(value, extraData) {
    if (!this._validators.length) {
      this._validators = this._parseConfig(this._configs);
    }
    return this._validate(value, extraData);
  }

  _validate(value, extraData) {
    let result;
    for (let v of this._validators) {
      result = v.validate(value, extraData);
      if (!result.isValid) return result;
    }
    return result || {value, isValid: true};
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

const vjs = {
  register: store.register,

  v(configs) {
    return new ValidatorQueue(configs);
  },

  map(validators) {
    return new ValidatorMap(validators);
  },

  setDefaultMessages() {
    // TODO, custom default messages
  },

  require(isRequired=true) {
    let validator = vjs.v();
    return isRequired ? validator : validator.noRequire();
  },

  number(config) {
    return vjs.v(Object.assign({type: Number}, config));
  },

  string(config) {
    return vjs.v(Object.assign({type: String}, config));
  },

  regexp(config) {
    if (config instanceof RegExp || typeof config === 'string') {
      config = {pattern: config};
    }
    return vjs.v(Object.assign({type: RegExp}, config));
  }
};

module.exports = vjs;
