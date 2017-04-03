const assert = require('assert');
const vajs = require('../lib');

const INVALID_MESSAGE = 'must be a number great than 5'

function getValidator() {
  return vajs.async((val) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result;
        if (val > 5) {
          result = new vajs.Result();
        } else {
          result = new vajs.Result({isValid: false, message: INVALID_MESSAGE});
        }
        resolve(result);
      }, 5);
    });
  });
}


describe('async', function () {
  it('async validation', function (done) {
    const v = getValidator();

    const validResult = v.validate(6);
    assert.ok(!validResult.isValid);
    assert.ok(validResult.pending);

    validResult
      .promise
      .then((result) => {
        assert.ok(result.isValid);
        v.validate(3)
          .promise
          .then((result) => {
            assert.ok(!result.isValid);
            assert.equal(result.message, INVALID_MESSAGE);
            done();
          });
      });
  });

  it('async validation resolve result', function (done) {
    const v = getValidator();

    const validResult = v.validate(6);
    assert.ok(!validResult.isValid);
    assert.ok(validResult.pending);

    validResult
      .promise
      .then((result) => {
        assert.ok(result.isValid);
        v.validate(3)
          .promise
          .then((result) => {
            assert.ok(!result.isValid);
            assert.equal(result.message, INVALID_MESSAGE);
            done();
          });
      });
  });

  it('async validation resolve string as invalid', function (done) {
    const v = vajs.async((val) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (val <= 5) {
            resolve(INVALID_MESSAGE);
          } else {
            resolve();
          }
        }, 5);
      });
    });

    const validResult = v.validate(6);
    assert.ok(!validResult.isValid);
    assert.ok(validResult.pending);

    validResult
      .promise
      .then((result) => {
        assert.ok(result.isValid);
        v.validate(3)
          .promise
          .then((result) => {
            assert.ok(!result.isValid);
            assert.equal(result.message, INVALID_MESSAGE);
            done();
          });
      });
  });

  it('async validation in vajs.map with onAsyncValidation option', function (done) {
    const v = getValidator();

    const vm = vajs.map({
      foo: v
    }, {
      onAsyncValidation(result) {
        assert.ok(result.isValid);
        assert.ok(!result.pending);
        assert.deepEqual(result, new vajs.MapResult({
          foo: new vajs.Result()
        }));
        done();
      }
    });

    const result = vm.validate({foo: 6});
    assert.ok(!result.isValid);
    assert.ok(result.pending);
  });

  it('async validation in vajs.map without onAsyncValidation option', function (done) {
    const vm = vajs.map({
      foo: getValidator()
    });

    const result = vm.validate({foo: 3});
    assert.ok(!result.isValid);
    assert.ok(result.pending);
    result.results.foo
      .promise
      .then(res => {
        result.results.foo = res;
        assert.ok(!result.isValid);
        assert.ok(!result.pending);
        done();
      });
  });

  it('async validation error', function (done) {
    const INVALID_MESSAGE = 'validation error'
    const v = vajs.async(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error(INVALID_MESSAGE));
        }, 5);
      });
    });

    const vm = vajs.map({
      foo: v
    });

    const result = vm.validate({foo: 3});
    assert.ok(!result.isValid);
    assert.ok(result.pending);
    result.results.foo
      .promise
      .catch(err => {
        assert.equal(err.message, INVALID_MESSAGE)
        done();
      });
  });
});
