'use strict';

var RequireValidator = require('./validators/require');

/**
 * 保存支持的验证器
 */
const ValidatorMap = new Map([
  ['require', RequireValidator]
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
