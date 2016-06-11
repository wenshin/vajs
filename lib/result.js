function Result({value, isValid, message, transformed}) {
  this.value = value,
  this.isValid = isValid === undefined ? true : !!isValid,
  this.message = message === undefined ? '' : message,
  this.transformed = transformed === undefined ? value : transformed;
}

module.exports = Result;
