# vajs

a common validator for javascript environment

## feature

# Install

    npm i --save vajs

# API

## Top Level

👉**vajs.v(configs)**

- `configs`: [Object|Array]. A config object or config array

  config types:

  1. `{type: Number, min: 0, max: 2, decimalPlace: 2, message: 'custom message'}`;
  2. `{type: String, maxLength: 10, minLength: 2, message: 'custom message'}`;
  3. `{type: 'custom', validate: value => value, message: 'custom message'}`;
  4. `{type: RegExp, pattern: /abc/i, message: 'custom message'}`;
  5. `value => value === false`;

  'message' can be a `String` or a `Function(config)`

- `return`: [vajs.Validator].

  ```javascript
  const va = vajs.v({type: Number, min: 0, max: 2})
  const result = va.validate(3);

  // result is a instance of vajs.Result
  // {
  // 	 isValid: [Boolean], // true is valid ok
  //	 message: [String], // fail message
  //	 value: [AnyType], // the source value
  //	 transformed: [AnyType], // the value transformed by validator. most for numbers
  // }

  // custom validator of 0.0.8 version
  const va = vajs.v((value) => {
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
- `message`: [String]. custom validate fail message

👉**vajs.integer(config|message)**

- `config`: [Object]. the config of Number but not decimalPlace
- `message`: [String]. custom validate fail message

👉**vajs.string(config|message)**

- `config`: [Object]. the config of String
- `message`: [String]. custom validate fail message

👉**vajs.regexp(config, message)**
- `config`: [Object|RegExp|String].
  if object is the config of RegExp validator.
  if RegExp or String is the config.type of RegExp validator.
- `message`: [String]. custom validate fail message


👉**vajs.map(config)**
if you want validate a object data, this is it.
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

  // {
  //   foo: {isValid: false, message: 'some fail message', value: '3', transformed: 3},
  //   bar: {isValid: false, message: 'some fail message'}
  // }
  ```

* `return`: [vajs.ValidatorMap].

# Develop

    $> npm i
    $> npm test
    $> npm publish

# Release Note

**v0.0.9 2016-11-14**

* the 'validate' property of custom validator, now can return a vajs.Result instance.



**v0.0.7 2016-05-15**

* first version

