const util = require('./util');

function MapResult(results, message) {
  if (results && typeof results !== 'object') throw new Error('MapResult(results, message) results must be a object or array');

  if (!(this instanceof MapResult)) return new MapResult(results, message);

  const self = this;

  this.message = message || '';
  this._results = results || {};

  Object.defineProperty(this, 'results', {
    get() {
      return this._results;
    },
    set(value) {
      if (!value || typeof value !== 'object') {
        throw TypeError('results must be a object');
      }
      for (const key of Object.keys(this._results)) {
        if (!(key in value)) {
          delete this._results[key];
        }
      }
      Object.assign(this._results, value);
    }
  });

  util.createProxyProperty(this, 'value', this._results);
  util.createProxyProperty(this, 'transformed', this._results);

  Object.defineProperties(self, {
    isValid: {
      get() {
        return !Object
          .keys(self._results)
          .filter((key) => !self._results[key].isValid)
          .length;
      }
    },
    pending: {
      get() {
        return !!Object
          .keys(self._results)
          .filter((key) => self._results[key].promise)
          .length;
      }
    }
  });
}

module.exports = MapResult;
