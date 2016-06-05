'use strict';

let error = require('../error');
let Validator = require('../validator');

const isEmpty = n => !n && n !== 0;

class NumberValidator extends Validator {
  transform(value) {
    let transformed = Number(value);
    if (transformed !== transformed) {
      throw new error.TransformError('NumberValidator', value);
    } else {
      return transformed;
    }
  }

  _getDefaultMessage(config) {
    const {min, max, decimalPlace} = config || this._config;
    let msg = '应为';
    msg += !isEmpty(max) && max === min ? ` ${max}` : '';
    msg += isEmpty(min) || max === min ? '' : `最小 ${min}${isEmpty(max) ? '' : '，'}`;
    msg += isEmpty(max) || max === min ? '' : `最大 ${max}`;
    msg += decimalPlace ? `${max || min ? '，' : ''}精确到 ${decimalPlace} 位小数的` : '';
    msg += !decimalPlace && (!isEmpty(max) || !isEmpty(min)) ? ' 的' : '';
    msg += decimalPlace === 0 ? '整数' : '数字';
    return msg;
  }

  _validate(value) {
    let {max, min, decimalPlace} = this._config;

    let isValid = (isEmpty(min) || value >= min) && (isEmpty(max) || value <= max);

    if (isValid && !isEmpty(decimalPlace)) {
      decimalPlace = Number(decimalPlace);
      if (decimalPlace >= 0) {
        let decimal = String(value).split('.')[1] || '';
        isValid = decimal.length <= decimalPlace;
      } else {
        throw new TypeError('`decimalPlace` of `NumberValidator` config must >= 0')
      }
    }
    return isValid;
  }
}

module.exports = NumberValidator;
