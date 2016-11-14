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
  vajs.map({
    foo: vajs.number({min: 1, max: 2, decimalPlace: 2}),
    bar: vajs.string({minLength: 2, maxLength: 4})
  })
  ```

# Develop

    $> npm i
    $> npm test
    $> npm publish

# Release Note

v0.0.7 2016-05-15

    * first version
