const store = require('./store');
const Result = require('./result');
const Validator = require('./validator');
const ValidatorMap = require('./validator-map');
const ValidatorQueue = require('./validator-queue');
const util = require('./util');

const vjs = {
  Result,
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
    const validator = vjs.v();

    if (typeof isRequired === 'string') {
      message = isRequired;
      isRequired = true;
    }

    return isRequired ? validator.require(message) : validator.notRequire();
  },

  /**
   * remote validation.
   *
   * NOTE: vajs.map().validate() will ignore all async validation
   * @param  {Function} promiseFactory
   * @param  {String|Function} message
   * @return {Promise}
   */
  async(promiseFactory, message) {
    return vjs.v({type: 'custom', validate: promiseFactory, message});
  },

  number(config) {
    if (typeof config === 'string') config = {message: config};
    return vjs.v(Object.assign({type: Number}, config));
  },

  integer(config) {
    if (typeof config === 'string') config = {message: config};
    return vjs.v(Object.assign({type: Number, decimalPlace: 0}, config));
  },

  string(config) {
    if (typeof config === 'string') config = {message: config};
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
