const assert = require('assert');
const vajs = require('../lib');

describe('regexp', function () {
  it('should valid success', function () {
    let v;
    let result;

    for (let config of [/abc/, 'abc', {pattern: 'abc'}]) {
      v = vajs.regexp(/abc/);
      result = v.validate('abc');
      assert.ok(result.isValid, `input ${config} must valid`);
    }
  });

  it('should valid fail', function () {
    let v = vajs.regexp(/abc/);
    let result = v.validate('ab');
    assert.equal(result.message, '格式不正确');
    assert.ok(!result.isValid);
  });

  it('should use custom message', function () {
    let v = vajs.regexp({pattern: 'abc', message: 'custom message'});
    let result = v.validate('ab');
    assert.equal(result.message, 'custom message');
    assert.ok(!result.isValid);

    v = vajs.regexp('abc', 'custom message');
    result = v.validate('ab');
    assert.equal(result.message, 'custom message');
    assert.ok(!result.isValid);
  });
});
