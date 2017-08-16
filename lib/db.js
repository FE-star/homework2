const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options={}){
    super();
    this.options = options
  }
}

DB.prototype.request = function(options={}) {
  options = this.applyPluginsWaterfall('options', options)
  this.options = Object.assign(this.options, options)
  return this.applyPluginsWaterfall('endpoint', this.options)
}

module.exports = DB

// class XX extends DB {
//   constructor(options) {
//     super(options)

//     this.plugin('endpoint', function () {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({ retcode: 0, res: { msg: 'hello world' } })
//         }, 0)
//       })
//     })
//   }
// }

// const xx = new XX()
// xx.request().then((res) => {
//   console.log(res)
//   done()
// })

// class YY extends DB {
//     constructor(options) {
//       super(options)
//       this.plugin('options', (options) => {
//         // modify options
//         options.flag = true
//         return options
//       })
//       this.plugin('endpoint', (options) => {
//         console.log(options)
//         // init
//         // assert.equal(options.init, true)
//         // merge
//         // assert.equal(options.url, 'my://hello')
//         // options plugin modify
//         // assert.equal(options.flag, true)

//         return new Promise((resolve, reject) => {
//           setTimeout(() => {
//             resolve({ retcode: 0, res: { msg: 'hello world' } })
//           }, 0)
//         })
//       })
//     }
//   }
// const yy = new YY({ init: true })
// yy.request({ url: 'my://hello' })
//       .then((res) => {
//         done()
//       })

// class ZZ extends DB {
//     constructor(options) {
//       super(options)
//       this.plugin('endpoint', function () {
//         return new Promise((resolve, reject) => {
//           reject()
//         })
//       })
//     }
//   }

//   const zz = new ZZ

//   zz.request()
//     .then(() => {
//       throw new Error('should not trigger resolve callback')
//     }, () => {
//       done()
//     })