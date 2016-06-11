const Result = require('./result');

class ValidatorMap {
  constructor(configs) {
    this._map = this._newMap(configs);
    this._inheritMap();
  }

  _newMap(configs) {
    let mapInit = configs;
    if ( !(configs instanceof Array) ) {
      mapInit = Object.keys(configs).map(key => [key, configs[key]]);
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
      : {value, isValid: true, transformed: value};
  }

  validate(fields, extraData) {
    const resultAll = new Result({
      value: fields,
      message: {},
      transformed: {}
    });

    const keys = Object.keys(fields);
    let iterator = keys;
    if (!iterator.length) iterator = this.keys();

    for (const key of iterator) {
      let result = this.validateOne(key, fields[key], extraData);

      key in fields && (resultAll.transformed[key] = result.transformed)

      if (!result.isValid) {
        resultAll.isValid = false;
        resultAll.message[key] = result.message;
      }
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
