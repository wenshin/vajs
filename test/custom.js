'use strict';

const assert = require('assert');
const vjs = require('../lib');

describe('custom', function () {
  it('should valid success', function () {
    let v = vjs.v((value, extraData) => value && extraData.test);
    let result = v.validate(true, {test: true});
    assert.ok(result.isValid);

  });

  it('should valid fail', function () {
    let result;
    let v = vjs.v((value, extraData) => value && extraData.test);
    for (let [value, extraData] of [[true, {test: false}], [false, {test: true}]]) {
      result = v.validate(value, extraData);
      assert.equal(result.message, '验证失败');
      assert.ok(!result.isValid);
    }
  });

  it('should use custom message', function () {
    let v = vjs.v({
      type: 'custom',
      validate: (value, extraData) => value && extraData.test,
      message: 'custom message'
    });
    let result = v.validate(true, {test: false});
    assert.equal(result.message, 'custom message');
    assert.ok(!result.isValid);
  });
});
