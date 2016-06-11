const assert = require('assert');
const vajs = require('../lib');

describe('validator-map', function () {
  it('validate success', function () {
    let target = {key1: '5'};
    let validator = vajs.number({max: 10, min: 1});
    let v;
    let result;
    for (let config of [{key1: validator}, [['key1', validator]]]) {
      v = vajs.map(config);
      result = v.validate(target);
      assert.deepStrictEqual(result, new vajs.Result({
        value: {key1: '5'},
        transformed: {key1: 5},
        message: {}
      }), `input ${config}`);
    }
  });

  it('validate fail', function () {
    let v = vajs.map({
      key1: vajs.number({max: 10, min: 1}),
      key2: vajs.string({maxLength: 2}),
      key3: vajs.v((value, extraData) => value && extraData.test)
    });

    let target = {key1: '11', key2: 'abc', key3: true};
    let result = v.validate(target, {test: false});
    assert.deepStrictEqual(result, new vajs.Result({
      value: {key1: '11', key2: 'abc', key3: true},
      transformed: {key1: 11, key2: 'abc', key3: true},
      isValid: false,
      message: {
        key1: '应为最小 1，最大 10 的数字',
        key2: '应最多 2 个字符',
        key3: '验证失败'
      }
    }));
  });

  it('transform data', function () {
    let v = vajs.map({
      key1: vajs.number({max: 10, min: 1})
    });
    let transformed = v.transform({key1: '8'});
    assert.strictEqual(transformed.key1, 8);
  });

  it('transform number invalid', function () {
    let v = vajs.map({
      key1: vajs.number({max: 10, min: 1})
    });
    let transformed = v.transform({key1: 'abc'});
    assert.strictEqual(transformed.key1, 'abc');
  })

  it('validate empty object', function () {
    const v = vajs.map({
      key1: vajs.number({max: 10, min: 1}),
      key2: vajs.number({max: 10, min: 1})
    });
    const result = v.validate({});
    assert.deepStrictEqual(result, new vajs.Result({
      value: {},
      transformed: {},
      isValid: false,
      message: {
        key1: '请务必填写',
        key2: '请务必填写'
      }
    }));
    assert.ok(!result.isValid);
  })

  it('validate undefined field', function () {
    const v = vajs.map({
      key1: vajs.number({max: 10, min: 1}),
      key2: vajs.number({max: 10, min: 1})
    });
    const result = v.validate({key2: '11'});
    assert.deepStrictEqual(result, new vajs.Result({
      value: {key2: '11'},
      transformed: {key2: 11},
      isValid: false,
      message: {
        key1: '请务必填写',
        key2: '应为最小 1，最大 10 的数字'
      }
    }));
    assert.ok(!result.isValid);
  })
});
