const assert = require('assert');
const vajs = require('../lib');

describe('async', function () {
  it('async validation', function (done) {
    const INVALID_MESSAGE = '不能小于5'
    let v = vajs.async((val) => {
      return new Promise((resolve, reject) => {
        if (val > 5) return resolve();
        return reject(INVALID_MESSAGE);
      });
    });

    v.validate(6)
      .then((validResult) => {
        assert.ok(validResult.isValid);
        v.validate(3)
          .catch((invalidResult) => {
            assert.ok(!invalidResult.isValid);
            assert.equal(invalidResult.message, INVALID_MESSAGE);
            done();
          });
      });
  });

  it('async validation return result', function (done) {
    const INVALID_MESSAGE = '不能小于5'
    let v = vajs.async((val) => {
      return new Promise((resolve, reject) => {
        if (val > 5) return resolve(new vajs.Result({isValid: true}));
        return reject(new vajs.Result({isValid: false, message: INVALID_MESSAGE}));
      });
    });

    v.validate(6)
      .then((validResult) => {
        assert.ok(validResult.isValid);
        v.validate(3)
          .catch((invalidResult) => {
            assert.ok(!invalidResult.isValid);
            assert.equal(invalidResult.message, INVALID_MESSAGE);
            done();
          });
      });
  });
});
