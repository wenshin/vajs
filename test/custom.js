'use strict';

const assert = require('assert');
const vajs = require('../lib');

describe('vajs.v() custom validation', function () {
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
    assert.ok(!result.isValid);
    assert.equal(result.message, 'this message');
  });

  it('validate return a string as fail', function () {
    let v = vajs.v(function validate() {
      return 'fail';
    });
    let result = v.validate(true);

    assert.equal(result.message, 'fail');
    assert.ok(!result.isValid);
  });

  it('validate return a plain object as fail', function () {
    let v = vajs.v(function validate() {
      return {isValid: false, message: 'fail'};
    });
    let result = v.validate(true);

    assert.equal(result.message, 'fail');
    assert.ok(!result.isValid);
  });

  it('validate return a plain object as success', function () {
    let v = vajs.v(function validate() {
      return {isValid: true, message: 'succ'};
    });
    let result = v.validate(true);

    assert.equal(result.message, 'succ');
    assert.ok(result.isValid);

    v = vajs.v(function validate() {
      return {isValid: true, message: null};
    });
    result = v.validate(true);

    assert.equal(result.message, '');
    assert.ok(result.isValid);
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

  it('validate can return a MapResult instance', function () {
    let v = vajs.v({
      type: 'custom',
      validate(obj) {
        return vajs.MapResult(
          {
            test: vajs.Result({
              value: obj.test,
              transformed: Number(obj.test),
              isValid: false,
              message: 'result message'
            })
          },
          'map result fail'
        );
      }
    });
    let result = v.validate({test: '1'});
    assert.ok(result instanceof vajs.MapResult);
    assert.equal(result.value.test, '1');
    assert.equal(result.transformed.test, 1);
    assert.equal(result.message, 'map result fail');
    assert.ok(!result.isValid);

    // validate required error
    result = v.validate();
    assert.ok(result instanceof vajs.Result);
    assert.equal(result.message, '请务必填写');
    assert.ok(!result.isValid);
  });

  it('should test right when notRequire', function () {
    const v = vajs.v(() => false).notRequire();
    const result = v.validate();
    assert.ok(result.isValid);
  });
});


describe('vajs.custom(validate, message) custom validation', function () {
  it('vajs.custom without require validation', function () {
    const v = vajs.custom((v) => v, 'my message');
    let result = v.validate(true);
    assert.ok(result.isValid);
    result = v.validate(false);
    assert.ok(!result.isValid);
    assert.equal(result.message, 'my message');
  });
});
