module.exports = {
  isPromise(value) {
    return value && value.then && value.catch;
  },

  createMapProxy(results, prop) {
    return new Proxy(results, {
      get: function(target, name) {
        if (name in target) {
          return target[name][prop];
        }
      },
      set: function(target, name, value) {
        target[name] = target[name] || {};
        return target[name][prop] = value;
      },
    });
  }
}
