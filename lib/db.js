const Tapable = require('tapable');
const {SyncHook} = require('tapable');

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options;
  }

  request(options) {
    // TODO
    if (this._plugins['options'] && this._plugins['options'].length) {
      options = Object.assign(options, this.options, this._plugins['options'].reduce((prev, curr) => {
        return curr.call(this, prev)
      }, options));
    }
    return this._plugins['endpoint'].map(func => func.call(this, options)).filter(func => !!func)[0].then(res => {
      if (this._plugins['judge'] && this._plugins['judge'].length) {
        if (this._plugins['judge'].every(func => func.call(this, res))) {
          return Promise.reject(res)
        }
      }
      return Promise.resolve(res)
    })
  }
}


module.exports = DB