'use strict';

const assert = require('assert');
const vajs = require('../lib');

describe('custom', function () {
  it('should valid success', function () {
    let v = vajs.v((value, extraData) => value && extraData.test);
    let result = v.validate(true, {test: true});
    assert.ok(result.isValid);

  });

  it('should valid fail', function () {
    let result;
    let v = vajs.v((value, extraData) => value && extraData.test);
    for (let [value, extraData] of [[true, {test: false}], [false, {test: true}]]) {
      result = v.validate(value, extraData);
      assert.equal(result.message, '验证失败');
      assert.ok(!result.isValid);
    }
  });

  it('should use custom message', function () {
    let v = vajs.v({
      type: 'custom',
      validate: (value, extraData) => value && extraData.test,
      message: 'custom message'
    });
    let result = v.validate(true, {test: false});
    assert.equal(result.message, 'custom message');
    assert.ok(!result.isValid);
  });

  it('message can be a function and validate `this` is config object', function () {
    let v = vajs.v({
      type: 'custom',
      validate(value, extraData) {
        if (!(value && extraData.test)) {
          this._message = 'this message';
          return false;
        }
        return true;
      },
      message(config) {
        return config._message;
      }
    });
    let result = v.validate(true, {test: false});
    assert.equal(result.message, 'this message');
    assert.ok(!result.isValid);
  });

  it('validate can return a Result instance', function () {
    let v = vajs.v({
      type: 'custom',
      validate(value, extraData) {
        if (!(value && extraData.test)) {
          return vajs.Result({
            isValid: false,
            message: 'result message'
          });
        }
        return true;
      }
    });
    let result = v.validate(true, {test: false});
    assert.equal(result.message, 'result message');
    assert.ok(!result.isValid);
  });
});
