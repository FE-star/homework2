const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
			super()
			this.options = options || {}
    // TODO
  }

  request(options = {}) {
  	this.applyPluginsWaterfall('options', this.options)
  	let option = Object.assign(options, this.options)

  	return new Promise((resolve, reject) => {
  		this.applyPluginsBailResult('endpoint', option).then(res => {
  			const judgeResult = this.applyPluginsBailResult('judge', res)
  			if (!judgeResult) {
  				resolve(res)
  			} else {
  				reject(res)
  			}
  		}).catch((res) => {
  			reject()
  		})
  	}) 
    // TODO
  }
}

module.exports = DB
