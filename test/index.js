'use strict';

const assert = require('assert');
const vjs = require('../lib');

describe('require', function () {
  const emptyValues = ['', null, undefined, NaN, {}, [], new Set(), new Map()];
  const notEmptyValues = [0, 'string type', {key: 1}, [1], () => {}];

  it('validate required', function () {
    const v = vjs.v();
    for (let empty of emptyValues) {
      assert.ok(!v.validate(empty).isValid, `<${empty}> must not be a required value`);
    }

    for (let notEmpty of notEmptyValues) {
      assert.ok(v.validate(notEmpty).isValid, `<${notEmpty}> must be a required value`);
    }
  });
});
