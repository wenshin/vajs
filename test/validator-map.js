'use strict';

const assert = require('assert');
const vjs = require('../lib');

describe('validator-map', function () {
  it('validate success', function () {
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

  it('validate fail', function () {
    let v = vjs.map({
      key1: vjs.number({max: 10, min: 1}),
      key2: vjs.string({maxLength: 2}),
      key3: vjs.v((value, extraData) => value && extraData.test)
    });

    let target = {key1: '11', key2: 'abc', key3: true};
    let result = v.validate(target, {test: false});
    assert.deepStrictEqual(result, {
      value: {key1: '11', key2: 'abc', key3: true},
      transformed: {key1: 11, key2: 'abc', key3: true},
      isValid: false,
      message: {
        key1: '应为最小 1，最大 10 的数字',
        key2: '应最多 2 个字符',
        key3: '验证失败'
      }
    });
  });

  it('transform data', function () {
    let v = vjs.map({
      key1: vjs.number({max: 10, min: 1})
    });
    let transformed = v.transform({key1: '8'});
    assert.strictEqual(transformed.key1, 8);
  });

  it('transform number invalid', function () {
    let v = vjs.map({
      key1: vjs.number({max: 10, min: 1})
    });
    let transformed = v.transform({key1: 'abc'});
    assert.strictEqual(transformed.key1, 'abc');
  })
});
