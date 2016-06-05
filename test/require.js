'use strict';

const assert = require('assert');
const vjs = require('../lib');

describe('require', function () {
  const emptyValues = ['', null, undefined, NaN, {}, [], new Set(), new Map()];
  const notEmptyValues = [0, false, 'string type', {key: 1}, [1], () => {}];

  it('validate when required which is default', function () {
    const v = vjs.require();

    for (let empty of emptyValues) {
      let result = v.validate(empty);
      if (empty === empty) {
        assert.equal(result.value, empty);
      } else {
        assert.notEqual(result.value, empty);
      }
      assert.equal(result.message, '请务必填写', `input ${empty}`);
      assert.ok(!result.isValid, `empty value <${empty}> must be invalid`);
    }

    for (let notEmpty of notEmptyValues) {
      assert.ok(v.validate(notEmpty).isValid, `not empty value <${notEmpty}> must be valid`);
    }
  });

  it('validate when not required', function () {
    const v = vjs.require(false);

    for (let empty of emptyValues) {
      assert.ok(v.validate(empty).isValid, `empty value <${empty}> must be valid`);
    }

    for (let notEmpty of notEmptyValues) {
      assert.ok(v.validate(notEmpty).isValid, `not empty value <${notEmpty}> must be valid`);
    }
  });
});
