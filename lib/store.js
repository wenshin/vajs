const RequireValidator = require('./validators/require');
const NumberValidator = require('./validators/number');
const StringValidator = require('./validators/string');
const RegExpValidator = require('./validators/regexp');
const CustomValidator = require('./validators/custom');

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
    if (ValidatorMap.has(type)) {
      throw new TypeError(`type ${type} validator exist`)
    }
    ValidatorMap.set(type, ValidatorCls);
    return ValidatorMap;
  },

  get(type) {
    return ValidatorMap.get(type);
  }
};
