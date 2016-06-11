const assert = require('assert');
const vajs = require('../lib');

describe('vajs', function () {
  it('export validator classes', function () {
    let v = vajs.v();
    assert.ok(v instanceof vajs.ValidatorQueue, 'ValidatorQueue');

    v = vajs.map({key: v});
    assert.ok(v instanceof vajs.ValidatorMap, 'ValidatorQueue');
  });

  it('register fail when validator exist', function () {
    assert.throws(() => vajs.register('custom', {}), /validator exist/)
  });

  it('register validator', function () {
    class TestValidator extends vajs.Validator {
      _getDefaultMessage() {
        return 'test message';
      }

      _validate(value) {
        return value > 1;
      }
    }

    vajs.register('test', TestValidator);

    let v = vajs.v({type: 'test'});
    let result = v.validate(2);
    assert.ok(result.isValid, 'pass');

    result = v.validate(1);
    assert.ok(!result.isValid, 'fail');
    assert.equal(result.message, 'test message');
  })
});
