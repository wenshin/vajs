const assert = require('assert');
const vajs = require('../lib');

describe('require', function () {
  const emptyValues = ['', null, undefined, NaN, {}, [], new Set(), new Map()];
  const notEmptyValues = [0, false, 'string type', {key: 1}, [1], () => {}];

  it('validate when required which is default', function () {
    const v = vajs.require();

    for (let empty of emptyValues) {
      let result = v.validate(empty);
      if (empty === empty) {
        assert.equal(result.value, empty);
      } else {
        assert.notEqual(result.value, empty);
      }
      assert.equal(result.message, '请务必填写', `input ${String(empty)}`);
      assert.ok(!result.isValid, `empty value <${String(empty)}> must be invalid`);
    }

    for (let notEmpty of notEmptyValues) {
      assert.ok(v.validate(notEmpty).isValid, `not empty value <${notEmpty}> must be valid`);
    }
  });

  it('validate when not required', function () {
    const v = vajs.require(false);

    for (let empty of emptyValues) {
      assert.ok(v.validate(empty).isValid, `empty value <${String(empty)}> must be valid`);
    }

    for (let notEmpty of notEmptyValues) {
      assert.ok(v.validate(notEmpty).isValid, `not empty value <${notEmpty}> must be valid`);
    }
  });

  it('validate with custom message', function () {
    const message = 'custom message';
    let v = vajs.require(true, message);
    let result = v.validate('');
    assert.equal(result.message, message);
    assert.ok(!result.isValid);

    v = vajs.require(message);
    result = v.validate('');
    assert.equal(result.message, message);
    assert.ok(!result.isValid);
  });

  it('config require in validator queue', function () {
    const message = 'custom message';
    let v = vajs.v([{require: false, message}, {type: 'number'}]);
    let result = v.validate('');
    assert.equal(result.message, message);
    assert.ok(!result.isValid);
  })
});
