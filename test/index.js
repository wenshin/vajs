'use strict';

const assert = require('assert');
const vjs = require('../lib');

describe('vajs', function () {
  it('export validator classes', function () {
    let v = vjs.v();
    assert.ok(v instanceof vjs.ValidatorQueue, 'ValidatorQueue');

    v = vjs.map({key: v});
    assert.ok(v instanceof vjs.ValidatorMap, 'ValidatorQueue');
  });

  it('register fail when validator exist', function () {
    assert.throws(() => vjs.register('custom', {}), /validator exist/)
  });

  it('register validator', function () {
    class TestValidator extends vjs.Validator {
      _getDefaultMessage() {
        return 'test message';
      }

      _validate(value) {
        return value > 1;
      }
    }

    vjs.register('test', TestValidator);

    let v = vjs.v({type: 'test'});
    let result = v.validate(2);
    assert.ok(result.isValid, 'pass');

    result = v.validate(1);
    assert.ok(!result.isValid, 'fail');
    assert.equal(result.message, 'test message');
  })
});
