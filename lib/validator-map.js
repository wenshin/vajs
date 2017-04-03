const Result = require('./result');
const MapResult = require('./map-result');

class ValidatorMap {
  /**
   * @param  {Object|Array} validators
   * is same to new Map(data)
   * @param  {Object} options
   * @param  {Object} options.onAsyncValidation
   * call when asyncValidation finished
   * @return {Result}
   * a object like `{isValid, message, results, promise, pending}`
   */
  constructor(validators, options = {}) {
    if (options.onAsyncValidation && typeof options.onAsyncValidation !== 'function') {
      throw new TypeError('vajs.ValidatorMap onAsyncValidation option must be a function');
    }

    this.onAsyncValidation = options.onAsyncValidation;
    this._map = this._newMap(validators);
    this._inheritMap();
  }

  _newMap(validators) {
    let mapInit = validators;
    if ( !(validators instanceof Array) ) {
      mapInit = Object.keys(validators).map(key => [key, validators[key]]);
    }
    return new Map(mapInit);
  }

  _inheritMap() {
    let inheritProps = [
      'get', 'set', 'size', 'has',
      'delete', 'clear',
      'keys', 'values',
      'entries', Symbol.iterator
    ];

    for (let prop of inheritProps) {
      this[prop] = this._map[prop] instanceof Function
        ? this._map[prop].bind(this._map)
        : this._map[prop];
    }
  }

  merge(validators) {
    for (let [key, validator] of validators) {
      this.set(key, validator);
    }
    this.size = this._map.size;
  }

  validateOne(key, value, extraData) {
    let validator = this.get(key);
    return validator
      ? validator.validate(value, extraData)
      : new Result({value});
  }

  validate(fields, extraData) {
    fields = fields || {};

    if (fields instanceof Array || fields instanceof Function
        || fields instanceof Map || fields instanceof Set
        || typeof fields !== 'object') {
      throw new TypeError('ValidatorMap.validate only accept object with out array and function');
    }

    const resultAll = new MapResult();

    for (const key of this.keys()) {
      let result = this.validateOne(key, fields[key], extraData);

      if (result.promise && this.onAsyncValidation) {
        result.promise = result.promise
          .then((res) => {
            resultAll.results[key] = res;
            this.onAsyncValidation && this.onAsyncValidation(resultAll);
            return resultAll;
          });
      }

      resultAll.results[key] = result;
    }

    return resultAll;
  }

  transformOne(key, value) {
    let validator = this.get(key);
    return validator
      ? validator.transform(value)
      : value;
  }

  transform(fields) {
    let transformed = {};
    for (let field of Object.keys(fields)) {
      transformed[field] = this.transformOne(field, fields[field]);
    }
    return transformed;
  }
}

module.exports = ValidatorMap;
