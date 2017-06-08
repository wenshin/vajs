const assert = require('assert');
const vajs = require('../lib');

describe('MapResult', function () {
  it('initiate with results', function () {
    const result = new vajs.MapResult({
      foo: new vajs.Result({value: '1', transformed: 1}),
      bar: new vajs.Result({value: '2', transformed: 2})
    });
    assert.strictEqual(result.value.foo, '1');
    assert.strictEqual(result.value.bar, '2');
    assert.strictEqual(result.transformed.foo, 1);
    assert.strictEqual(result.transformed.bar, 2);
  });

  it('replace results', function () {
    const result = new vajs.MapResult();
    result.results = {
      foo: new vajs.Result({value: '1', transformed: 1}),
      bar: new vajs.Result({value: '2', transformed: 2})
    };
    assert.strictEqual(result.value.foo, '1');
    assert.strictEqual(result.value.bar, '2');
    assert.strictEqual(result.transformed.foo, 1);
    assert.strictEqual(result.transformed.bar, 2);
  });

  it('initiate with results and replace results', function () {
    const result = new vajs.MapResult({
      foo: new vajs.Result({value: '2', transformed: 2}),
      foobar: new vajs.Result({value: '3', transformed: 3})
    });

    result.results = {
      foo: new vajs.Result({value: '1', transformed: 1}),
      bar: new vajs.Result({value: '2', transformed: 2})
    };

    assert.strictEqual(result.value.foo, '1');
    assert.strictEqual(result.value.bar, '2');
    assert.strictEqual(result.transformed.foo, 1);
    assert.strictEqual(result.transformed.bar, 2);
    assert.ok(!result.value.foobar);
    assert.ok(!result.transformed.foobar);
  });

  it('update results', function () {
    const result = new vajs.MapResult();
    result.results.foo = new vajs.Result({value: '1', transformed: 1});
    result.results.bar = new vajs.Result({value: '2', transformed: 2});
    assert.strictEqual(result.value.foo, '1');
    assert.strictEqual(result.value.bar, '2');
    assert.strictEqual(result.transformed.foo, 1);
    assert.strictEqual(result.transformed.bar, 2);
  });

  it('update results from value and transformed', function () {
    const result = new vajs.MapResult({
      foo: new vajs.Result({value: '1', transformed: 1})
    });
    result.value.foo = '2'
    result.transformed.foo = 2
    assert.strictEqual(result.results.foo.value, '2');
    assert.strictEqual(result.results.foo.transformed, 2);
  });
});
