module.exports = {
  isPromise(value) {
    return value && value.then && value.catch;
  }
}
