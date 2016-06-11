const Validator = require('../validator');

/**
 * String value validation
 *
 * @param {Object}  config
 * @param {Number}  config.minLength  字符串最小长度
 * @param {Number}  config.maxLength  字符串最大长度
 * @param {Boolean} config.cn         `optional`，默认`false`， 1个中文字符是否按长度2处理
 */
class StringValidator extends Validator {
  _getDefaultMessage(config) {
    let {minLength, maxLength} = config;
    let msg;

    if (maxLength === minLength && maxLength) {
      msg = `应等于 ${maxLength} 个字符`;
    } else if (maxLength || minLength) {
      msg = maxLength || minLength ? '应' : '';
      msg += minLength ? `最少 ${minLength}` : '';
      msg += maxLength ? `${minLength ? '，' : ''}最多 ${maxLength}` : '';
      msg += maxLength || minLength ? ' 个字符' : '';
    } else {
      msg = '应为字符串';
    }

    return msg;
  }

  _validate(value) {
    let {cn, minLength, maxLength} = this._config;
    let length = cn ? getCNStrLength(value) : value.length;
    let isValid = typeof value === 'string';
    return isValid
      && (minLength ? length >= minLength : true)
      && (maxLength ? length <= maxLength : true);
  }
}

function getCNStrLength(str) {
  let len = 0;
  let getCharLength = char => {
    // judge if code point great than 16 bit.
    // NOTE: this is a not precise method to judge a chinese unicode code point great than 16 bit
    if (char.length > 1) {
      return 2;
    // judge if a chinese character code point of 16 bit . see below for more detail
    // https://zh.wikipedia.org/wiki/%E4%B8%AD%E6%97%A5%E9%9F%93%E7%B5%B1%E4%B8%80%E8%A1%A8%E6%84%8F%E6%96%87%E5%AD%97
    // http://www.ruanyifeng.com/blog/2014/12/unicode.html
    } else if (char >= '\u4E00' && char <= '\u9FFF') {
      return 2;
    } else {
      return 1;
    }
  };
  for (let char of str) {
    len += getCharLength(char);
  }
  return len;
}

module.exports = StringValidator;
