const store = require('./store');
const Result = require('./result');
const MapResult = require('./map-result');
const Validator = require('./validator');
const ValidatorMap = require('./validator-map');
const ValidatorQueue = require('./validator-queue');
const util = require('./util');

const vajs = {
  Result,
  MapResult,
  Validator,
  ValidatorMap: ValidatorMap,
  ValidatorQueue: ValidatorQueue,

  util,
  register: store.register,

  v(configs) {
    return new ValidatorQueue(configs);
  },

  map(validators, options) {
    return new ValidatorMap(validators, options);
  },

  setDefaultMessages() {
    // TODO, custom default messages
  },

  require(isRequired=true, message) {
    const validator = vajs.v();

    if (typeof isRequired === 'string') {
      message = isRequired;
      isRequired = true;
    }

    return isRequired ? validator.require(message) : validator.notRequire();
  },

  number(config) {
    if (typeof config === 'string') config = {message: config};
    return vajs.v(Object.assign({type: Number}, config));
  },

  integer(config) {
    if (typeof config === 'string') config = {message: config};
    return vajs.v(Object.assign({type: Number, decimalPlace: 0}, config));
  },

  string(config) {
    if (typeof config === 'string') config = {message: config};
    return vajs.v(Object.assign({type: String}, config));
  },

  regexp(config, message) {
    if (config instanceof RegExp || typeof config === 'string') {
      config = {pattern: config, message};
    }
    return vajs.v(Object.assign({type: RegExp}, config));
  },

  custom(validate, message) {
    const CustomValidator = store.get('custom');
    return new CustomValidator({validate, message});
  },

  async(promiseFactory, message) {
    const v = vajs.custom(promiseFactory, message);
    v.type = 'async';
    return v;
  },
};

module.exports = vajs;
