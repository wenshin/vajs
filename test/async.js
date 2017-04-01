const assert = require('assert');
const vajs = require('../lib');

describe('async', function () {
  it('async validation', function (done) {
    const INVALID_MESSAGE = '不能小于5'
    const v = vajs.async((val) => {
      return new Promise((resolve, reject) => {
        if (val > 5) return resolve();
        return reject(INVALID_MESSAGE);
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
          .catch((result) => {
            assert.ok(!result.isValid);
            assert.equal(result.message, INVALID_MESSAGE);
            done();
          });
      });
  });

  it('async validation return result', function (done) {
    const INVALID_MESSAGE = '不能小于5'
    const v = vajs.async((val) => {
      return new Promise((resolve, reject) => {
        if (val > 5) return resolve(new vajs.Result({isValid: true}));
        return reject(new vajs.Result({isValid: false, message: INVALID_MESSAGE}));
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
          .catch((result) => {
            assert.ok(!result.isValid);
            assert.equal(result.message, INVALID_MESSAGE);
            done();
          });
      });
  });
});
