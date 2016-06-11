const assert = require('assert');
const vajs = require('../lib');

describe('Number', function () {

  it('should pass when valid input', function () {
    const validInputs = [0, 1.1, 123e3, 123e-3, 0b11, 0x10, 0o10, Infinity];

    const v = vajs.number();

    for (let valid of validInputs) {
      let result = v.validate(valid);
      let resultStr = v.validate(String(valid));
      assert.deepEqual(result, resultStr);
      assert.ok(result.isValid, `${valid} must be a number`)
      assert.equal(result.value, valid)
    }
  });

  it('should fail when invalid input', function () {
    const inValidInputs = ['12fe', '=!&7', 'NaN'];

    const v = vajs.number();

    for (let invalid of inValidInputs) {
      let result = v.validate(invalid);
      assert.equal(result.message, `应为数字`, `input ${invalid}`);
      assert.ok(!result.isValid);
    }
  });

  it('should fail by require when empty input', function () {
    const inValidInputs = ['', NaN, [], {}];

    const v = vajs.number();

    for (let invalid of inValidInputs) {
      let result = v.validate(invalid);
      assert.equal(result.message, `请务必填写`, `input ${invalid}`)
      assert.ok(!result.isValid);
    }
  });

  it('should validate integer right', function () {
    const integers = [1, -1, '11', '-1.'];
    const floats = [1.1, -1.1, '11.1', '-1.1'];

    const v = vajs.number({decimalPlace: 0});

    for (let integer of integers) {
      let result = v.validate(integer);
      assert.ok(result.isValid, `integer input ${integer}`)
      assert.ok(result.value === integer, `${integer} strict equal to ${result.value}`)
      assert.ok(result.transformed === Number(integer), `${integer} strict equal to ${result.value}`)
    }

    for (let float of floats) {
      let result = v.validate(float);
      assert.equal(result.message, '应为整数', `float input ${float}`)
    }
  });

  it('should validate float number with decimalPlace right', function () {
    const v = vajs.number({decimalPlace: 2});

    let result = v.validate('1.222');
    assert.equal(result.message, '应为精确到 2 位小数的数字')
    assert.ok(!result.isValid);
  });


  it('should validate max and min and decimalPlace right', function () {
    let v = vajs.number({max: 10});

    let result = v.validate(11);
    assert.equal(result.message, '应为最大 10 的数字')
    assert.ok(!result.isValid);

    v = vajs.number({min: 10});
    result = v.validate(9);
    assert.equal(result.message, '应为最小 10 的数字')
    assert.ok(!result.isValid);

    v = vajs.number({min: 10, max: 15});
    result = v.validate(9);
    assert.equal(result.message, '应为最小 10，最大 15 的数字')
    assert.ok(!result.isValid);

    v = vajs.number({min: 10, max: 15, decimalPlace: 0});
    result = v.validate(9);
    assert.equal(result.message, '应为最小 10，最大 15 的整数')
    assert.ok(!result.isValid);

    v = vajs.number({min: 10, max: 15, decimalPlace: 2});
    result = v.validate(9.333);
    assert.equal(result.message, '应为最小 10，最大 15，精确到 2 位小数的数字')
    assert.ok(!result.isValid);

    v = vajs.number({min: 10, decimalPlace: 2});
    result = v.validate(9.333);
    assert.equal(result.message, '应为最小 10，精确到 2 位小数的数字')
    assert.ok(!result.isValid);

    v = vajs.number({max: 10, decimalPlace: 2});
    result = v.validate(10.333);
    assert.equal(result.message, '应为最大 10，精确到 2 位小数的数字')
    assert.ok(!result.isValid);
  });

  it('should use config.message', function () {
    let message = 'custom message';
    let config = {max: 10, min: 1, decimalPlace: 2, message};
    let v = vajs.number(config);
    let result = v.validate(0);
    assert.equal(result.message, message)
    assert.ok(!result.isValid);

    config.message = config => `${config.max} ${config.min} ${config.decimalPlace}`;
    v = vajs.number(config);
    result = v.validate(0);
    assert.equal(result.message, config.message(config))
    assert.ok(!result.isValid);
  });

  it('validate intger alias', function () {
    let message = 'custom message';
    let config = {max: 10, min: 1, message};
    let v = vajs.integer(config);
    let result = v.validate('1.1');
    assert.equal(result.message, message)
    assert.ok(!result.isValid);
  });
});
