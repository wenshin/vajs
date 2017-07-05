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

  it('should validate fail', function () {
    let v = vajs.regexp(/abc/);
    let result = v.validate('ab');
    assert.equal(result.message, '格式不正确');
    assert.ok(!result.isValid);
    result = v.validate('abc');
    assert.equal(result.message, '');
    assert.ok(result.isValid);
  });

  it('should validate regular expression with global flag right', function () {
    let v = vajs.regexp(/\w+/g);
    let result = v.validate('a');
    result = v.validate('a');
    assert.ok(result.isValid);
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

  it('should test rigth when notRequire', function () {
    let v = vajs.regexp({pattern: 'abc', message: 'custom message'}).notRequire();
    result = v.validate();
    assert.ok(result.isValid);
  });
});
