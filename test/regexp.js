'use strict';

const assert = require('assert');
const vjs = require('../lib');

describe('regexp', function () {
  it('should valid success', function () {
    let v;
    let result;

    for (let config of [/abc/, 'abc', {pattern: 'abc'}]) {
      v = vjs.regexp(/abc/);
      result = v.validate('abc');
      assert.ok(result.isValid, `input ${config} must valid`);
    }
  });

  it('should valid fail', function () {
    let v = vjs.regexp(/abc/);
    let result = v.validate('ab');
    assert.equal(result.message, '格式不正确');
    assert.ok(!result.isValid);
  });

  it('should use custom message', function () {
    let v = vjs.regexp({pattern: 'abc', message: 'custom message'});
    let result = v.validate('ab');
    assert.equal(result.message, 'custom message');
    assert.ok(!result.isValid);

    v = vjs.regexp('abc', 'custom message');
    result = v.validate('ab');
    assert.equal(result.message, 'custom message');
    assert.ok(!result.isValid);
  });
});
