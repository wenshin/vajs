const util = require('./util');

function MapResult(results, message) {
  if (results && typeof results !== 'object') throw new Error('MapResult(results, message) results must be a object or array');

  if (!(this instanceof MapResult)) return new MapResult(results, message);

  this.message = message || '';
  this.results = results || {};
  this.value = util.createMapProxy(this.results, 'value');
  this.transformed = util.createMapProxy(this.results, 'transformed');

  const self = this;
  Object.defineProperties(self, {
    isValid: {
      get() {
        return !Object
          .keys(self.results)
          .filter((key) => !self.results[key].isValid)
          .length;
      }
    },
    pending: {
      get() {
        return !!Object
          .keys(self.results)
          .filter((key) => self.results[key].promise)
          .length;
      }
    }
  });
}

module.exports = MapResult;
