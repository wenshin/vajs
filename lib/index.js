'use strict';

var store = require('./store');
var Validator = require('./validator');
var ValidatorMap = require('./validator-map');
var ValidatorQueue = require('./validator-queue');

const vjs = {
  Validator,
  ValidatorMap: ValidatorMap,
  ValidatorQueue: ValidatorQueue,

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

  require(isRequired=true, message) {
    const validator = vjs.v();

    if (typeof isRequired === 'string') {
      message = isRequired;
      isRequired = true;
    }

    return isRequired ? validator.require(message) : validator.notRequire();
  },

  number(config) {
    return vjs.v(Object.assign({type: Number}, config));
  },

  integer(config) {
    return vjs.v(Object.assign({type: Number, decimalPlace: 0}, config));
  },

  string(config) {
    return vjs.v(Object.assign({type: String}, config));
  },

  regexp(config, message) {
    if (config instanceof RegExp || typeof config === 'string') {
      config = {pattern: config, message};
    }
    return vjs.v(Object.assign({type: RegExp}, config));
  }
};

module.exports = vjs;
