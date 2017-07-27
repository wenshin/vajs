# vajs

a common validator for javascript environment
> vajs used Proxy it's not completely support by browsers,
> detail see [Proxy compatible](http://caniuse.com/#search=Proxy).


# Install
    npm i --save vajs

# API

## Top Level

👉**vajs.v(configs)**

create a validator of ValidatorQueue, which will run require validation first. If the target is not required, call `ValidatorQueue.prototype.notRequire` method.

- `configs`: [Object|Array|Function].

  **object config**

  1. `{type: Number, min: 0, max: 2, decimalPlace: 2, message: 'custom message'}`;
  2. `{type: String, maxLength: 10, minLength: 2, message: 'custom message'}`;
  3. `{type: 'custom', validate: value => value, message: 'custom message'}`;
  4. `{type: RegExp, pattern: /abc/i, message: 'custom message'}`;

  message property is type of  String or Function. If is a function, it will get config as parameter.

  *array config**, is the array of object config

  ```javascript
  [
    {type: Number, min: 0, max: 2, decimalPlace: 2, message: 'custom message'},
    {type: RegExp, pattern: /abc/i, message: 'custom message'}
  ]
  ```

  **function config**, a function receive value and extraData two parameters.
  the extraData is passed by `ValidatorQueue.prototype.validate` method.
  then function can return a `vajs.Result` instance, `vajs.MapResult` instance, string, boolean and object like `{isValid, message?}`

- `return`: [vajs.Validator|vajs.ValidatorQueue].

  ```javascript
  let va = vajs.v({type: Number, min: 0, max: 2})

  // return ValidatorQueue instance
  const result = va.validate(3).notRequire();

  // result is a instance of vajs.Result
  // {
  // 	 isValid: [Boolean], // true is valid ok
  //	 message: [String], // fail message
  //	 value: [AnyType], // the source value
  //	 transformed: [AnyType], // the value transformed by validator. most for numbers
  // }

  // return CustomValidator instance
  va = vajs.v((value) => {
    if (false) return vajs.Result({
      isValid: false,
      value: value,
      message: 'validate fail'
    });
    return true;
  });

  const result = va.validate(1);
  // {isValid: true, message: 'validate fail'}
  ```

👉**vajs.number(config|message)**

- `config`: [Object]. the config of Number
- `message`: [String|Function]. A custom validate fail message or a function return fail message

👉**vajs.integer(config|message)**

- `config`: [Object]. the config of Number but not decimalPlace
- `message`: [String|Function].

👉**vajs.string(config|message)**

- `config`: [Object]. the config of String
- `message`: [String|Function].

👉**vajs.regexp(config, message)**

- `config`: [Object|RegExp|String].
  if object is the config of RegExp validator.
  if RegExp or String is the config.type of RegExp validator.
- `message`: [String|Function].

👉**vajs.custom(validate, message)**

This alias is different to `vajs.v(configs)` receive a function
> **NOTE**: it will not run require validation by default.

* `validate`: [Function], same with `vajs.v(functionConfig)`
* `message`: [String|Function]

👉**vajs.async(promiseFactory, message)**
async validator is a CustomValidator which will return a result with `pending` and `promise` property.

>**NOTE**:
>
>1. resolve the validation result even validation fail, and reject a Error instance when validation have a error.
>2. it will not run require validation by default.

- `promiseFactory`: [Functoin]. A function return a promise
- `message`: [String|Function].

👉**vajs.map(config, {onAsyncValidation})**
if you want validate a object data, this is it.
it has `validate` and `validateOne` api.
`validate` method return a result will have a `results` property.

* `config`: [Object]. a plain object of validators for the target object props

  usages

  ```javascript
  const va = vajs.map({
    foo: vajs.number({min: 1, max: 2, decimalPlace: 2, message: 'less than 2 and great than 1'}),
    bar: vajs.string({minLength: 2, maxLength: 4, message: 'string length less than 4 and great than {}'})
  });

  const resultObj = va.validate({
    foo: '3',
    bar: 'foobar'
  });

  // vajs.MapResult {
  //   isValid: false,
  //   value: {foo: '3', bar: 'foobar'},
  //   transformed: {foo: 3, bar: 'foobar'}
  //   results: {
  //     foo: [Result {isValid: false, message: 'some fail message', value: '3', transformed: 3}],
  //     bar: [Result {isValid: false, message: 'some fail message'}]
  //   },
  // }
  ```

* `onAsyncValidation`: a function invoked when async validation finished. the argument is the result

* `return`: [vajs.ValidatorMap].

# Develop

    $> npm i
    $> npm test
    $> npm publish

# Release Note

**v1.0.7 2017-07-27**
* support ie >= 9

**v1.0.6 2017-07-05**
* fix `vajs.regexp()` bug

**v1.0.5 2017-06-13**

* fix `vajs.regexp()` bug caused by `RegExp.prototype.test()`

**v1.0.4 2017-06-08**

* remove Proxy dependency

**v1.0.3 2017-06-05**

* custom validation return value will support string, boolean and object like {isValid, message}


**v1.0.2 2017-05-10**

* vajs.async() will not run require validation default


**v1.0.1 2017-05-07**

* vajs.v() custom validation can return a vajs.MapResult instance.
* add vajs.custom() to deal with the custom validation without auto require validation.


**v1.0.0 2017-04-03**

* add async validation.
* ResultMap for `ValidatorMap.validate` method.

**v0.1.0 2017-03-06**

* auto trim spaces before validate


**v0.0.10 2016-11-24**

* fix ValidatorQueue.notRequire() validate fail bug


**v0.0.9 2016-11-14**

* the 'validate' property of custom validator, now can return a vajs.Result instance.


**v0.0.7 2016-05-15**

* first version

