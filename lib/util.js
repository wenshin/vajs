module.exports = {
  isPromise(value) {
    return value && value.then && value.catch;
  },

  createProxyProperty(obj, prop, target) {
    Object.defineProperty(obj, prop, {
      get() {
        const ret = {};
        for (const key of Object.keys(target)) {
          if (!target[key] || typeof target[key] !== 'object') {
            throw new Error('createProxyProperty(obj, prop, target) the property of target must be a object');
          }
          Object.defineProperty(ret, key, {
            get() {
              return target[key][prop];
            },
            set(value) {
              target[key][prop] = value;
            }
          });
        }
        return ret;
      },
      set(value) {
        for (const key of Object.keys(target)) {
          if (!target[key] || typeof target[key] !== 'object') {
            throw new Error('createProxyProperty(obj, prop, target) the property of target must be a object');
          }
          target[key][prop] = value[key];
        }
      }
    })
  },

  createMapProxy(results, prop) {
    // Proxy is not support good enough, worsely there is no polyfill good enough
    // So do not use this function until the support of browser is better.
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
