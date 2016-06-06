'use strict';

const assert = require('assert');
const vjs = require('../lib');

describe('validator-map', function () {
  it('should valid success', function () {
    let target = {key1: '5'};
    let validator = vjs.number({max: 10, min: 1});
    let v;
    let result;
    for (let config of [{key1: validator}, [['key1', validator]]]) {
      v = vjs.map(config);
      result = v.validate(target);
      assert.deepStrictEqual(result, {
        value: {key1: '5'},
        transformed: {key1: 5},
        isValid: true,
        message: {}
      }, `input ${config}`);
    }
  });

  it('should valid fail', function () {
    let v = vjs.map({
      key1: vjs.number({max: 10, min: 1}),
      key2: vjs.string({maxLength: 2})
    });

    let target = {key1: '11', key2: 'abc'};
    let result = v.validate(target);
    assert.deepStrictEqual(result, {
      value: {key1: '11', key2: 'abc'},
      transformed: {key1: 11, key2: 'abc'},
      isValid: false,
      message: {
        key1: '应为最小 1，最大 10 的数字',
        key2: '应最多 2 个字符'
      }
    });
  });
});
