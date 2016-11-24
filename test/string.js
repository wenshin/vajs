const assert = require('assert');
const vajs = require('../lib');

describe('string', function () {
  it('should only can input string value', function () {
    const v = vajs.string();

    const validInputs = ['1', '中', String('1'), String('中')];
    const inValidInputs = [0, 1, true, false, {key: 1}, [1]];

    for (let valid of validInputs) {
      let result = v.validate(valid);
      assert.ok(result.isValid, `valid input ${valid}`);
      assert.ok(result.value === valid, `valid input ${valid}`);
    }

    for (let invalid of inValidInputs) {
      let result = v.validate(invalid);
      assert.equal(result.message, '应为字符串');
    }
  });

  it('should get right message', function () {
    let v = vajs.string();
    let result = v.validate('');
    assert.equal(result.message, '请务必填写');
    assert.ok(!result.isValid);

    v = vajs.string({maxLength: 2});
    result = v.validate('a中b');
    assert.equal(result.message, '应最多 2 个字符');
    assert.ok(!result.isValid);

    v = vajs.string({minLength: 2});
    result = v.validate('中');
    assert.equal(result.message, '应最少 2 个字符');
    assert.ok(!result.isValid);

    v = vajs.string({minLength: 2, maxLength: 4});
    result = v.validate('a');
    assert.equal(result.message, '应最少 2，最多 4 个字符');
    assert.ok(!result.isValid);

    v = vajs.string({minLength: 2, maxLength: 4, cn: true});
    result = v.validate('a𠮷中');
    assert.equal(result.message, '应最少 2，最多 4 个字符', '中文长度为2');
    assert.ok(!result.isValid);
  });

  it('should test rigth when notRequire', function () {
    const v = vajs.string().notRequire();

    result = v.validate();
    assert.ok(result.isValid);
  });
});
