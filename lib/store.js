'use strict';

var RequireValidator = require('./validators/require');
var NumberValidator = require('./validators/number');
var StringValidator = require('./validators/string');
var RegExpValidator = require('./validators/regexp');
var CustomValidator = require('./validators/custom');

/**
 * 保存支持的验证器
 */
const ValidatorMap = new Map([
  ['require', RequireValidator],
  ['number', NumberValidator],
  [Number, NumberValidator],
  ['string', StringValidator],
  [String, StringValidator],
  ['regexp', RegExpValidator],
  [RegExp, RegExpValidator],
  ['custom', CustomValidator]
]);

module.exports = {
  register(type, ValidatorCls) {
    ValidatorMap.set(type, ValidatorCls);
    return ValidatorMap;
  },

  get(type) {
    return ValidatorMap.get(type);
  }
};
