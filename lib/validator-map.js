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
    let resultAll = {
      value: fields,
      isValid: true,
      message: {},
      transformed: {}
    };

    for (let field of Object.keys(fields)) {
      let result = this.validateOne(field, fields[field], extraData);
      resultAll.transformed[field] = result.transformed;
      if (!result.isValid) {
        resultAll.isValid = false;
        resultAll.message[field] = result.message;
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
