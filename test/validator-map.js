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
        results: {
          key1: new vajs.Result({
            transformed: 5,
            value: '5'
          })
        }
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
      results: {
        key1: new vajs.Result({
          isValid: false,
          message: '应为最小 1，最大 10 的数字',
          value: '11',
          transformed: 11
        }),
        key2: new vajs.Result({
          isValid: false,
          message: '应最多 2 个字符',
          value: 'abc',
          transformed: 'abc'
        }),
        key3: new vajs.Result({
          isValid: false,
          message: '验证失败',
          value: true,
          transformed: true
        })
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

    const emptyValues = [undefined, null, '', 0, NaN, {}]

    for (const empty of emptyValues) {
      const result = v.validate(empty);
      assert.deepStrictEqual(result, new vajs.Result({
        value: {},
        transformed: {},
        isValid: false,
        results: {
          key1: new vajs.Result({
            isValid: false,
            message: '请务必填写'
          }),
          key2: new vajs.Result({
            isValid: false,
            message: '请务必填写'
          })
        }
      }));
      assert.ok(!result.isValid);
    }
  })

  it('throw TypeError when validate not object', function () {
    const v = vajs.map({
      key1: vajs.number({max: 10, min: 1}),
      key2: vajs.number({max: 10, min: 1})
    });

    const notObjectValues = ['abc', 10, [1, 2], () => {}, new Map(), new Set()]

    for (const notObject of notObjectValues) {
      assert.throws(() => {v.validate(notObject)}, TypeError)
    }
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
      results: {
        key1: new vajs.Result({
          isValid: false,
          message: '请务必填写'
        }),
        key2: new vajs.Result({
          isValid: false,
          message: '应为最小 1，最大 10 的数字',
          value: '11',
          transformed: 11
        })
      }
    }));
    assert.ok(!result.isValid);
  })
});
