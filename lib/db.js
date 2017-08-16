const Tapable = require('tapable')

const merge = (from, to) => {
  const fromType = typeof from
  if (fromType !== 'object') {
    return to
  }
  to = to || {}
  const hasOwn = Object.prototype.hasOwnProperty
  for (var key in from) {
    if (hasOwn.call(from, key)) {
      to[key] = from[key]
    }
  }
  return to
}

class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options || {}
  }

  request(options) {
    return new Promise((resolve, reject) => {
      this.options = merge(options, this.options)
      this.options = this.applyPluginsWaterfall('options', this.options)
      this.applyPluginsBailResult('endpoint', this.options).then(result => {
        if (this.applyPluginsBailResult('judge', result)) {
          reject(result)
        } else {
          resolve(result)
        }
      })
      .catch(result => {
        reject(result)
      })
    })
  }
}

module.exports = DB