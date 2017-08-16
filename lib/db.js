const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super()
    this.options = options || {}
  }

  request(params) {
    // TODO
    merge(this.options, params)
    this.applyPlugins('options', this.options)

    return this.applyPluginsBailResult('endpoint', this.options)
      .then(res => {
        if (!this._plugins.judge) {
          return Promise.resolve(res)
        }

        return this.applyPluginsWaterfall('judge', res) ?
          Promise.reject(res) : Promise.resolve(res)
      })
  }
}

function merge(_to, _from) {
  if (!_from) return _to
  for (var key in _from) {
    _to[key] = _from[key]
  }

  return _to
}

module.exports = DB
