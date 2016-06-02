'use strict';

var store = require('./store');

class ValiidatorQueue {
  constructor(configs = []) {
    this._configs = configs;
    this._validators = [];
    this._require = true;
  }

  noRequire() {
    this._require = false;
    return this;
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
    const ValidatorCls = store.get(config.type);
    if (!ValidatorCls) throw new TypeError(`${config.type} validator not registered`);
    return new ValidatorCls(config);
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
}

const vjs = {
  register: store.register,

  v: configs => new ValiidatorQueue(configs),

  require() {
    return vjs.v();
  },

  noRequire() {
    return vjs.v().noRequire();
  },

  number(config) {
    return vjs.v(Object.assign({type: Number, config}));
  }
};

module.exports = vjs;
