let DB = require('../lib/db')
// just for the real answer, please ignore
// if (!DB.prototype.request) {
//   DB = require('../lib/.db')
// }
const assert = require('assert')

describe('DB', function () {
  it('可以设置options', function () {
    const options = {}
    const db = new DB(options)
    assert.equal(db.options, options)
  })

  it('可以设置endpoint插件，使得该请求用制定的方式处理', function (done) {
    class XX extends DB {
      constructor(options) {
        super(options)

        this.plugin('endpoint', function () {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ retcode: 0, res: { msg: 'hello world' } })
            }, 0)
          })
        })
      }
    }

    const xx = new XX()
    xx.request()
      .then((res) => {
        assert.equal(res.res.msg, 'hello world')
        done()
      })
  })

  it('可以设置options插件来处理options', function (done) {
    class YY extends DB {
      constructor(options) {
        super(options)
        this.plugin('options', (options) => {
          // modify options
          options.flag = true
          return options
        })
        this.plugin('endpoint', (options) => {
          // init
          assert.equal(options.init, true)
          // merge
          assert.equal(options.url, 'my://hello')
          // options plugin modify
          assert.equal(options.flag, true)

          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve({ retcode: 0, res: { msg: 'hello world' } })
            }, 0)
          })
        })
      }
    }

    it('可以reject数据', function (done) {
      class ZZ extends DB {
        constructor(options) {
          super(options)
          this.plugin('endpoint', function () {
            return new Promise((resolve, reject) => {
              reject()
            })
          })
        }
      }

      const zz = new ZZ

      zz.request()
        .then(() => {
          throw new Error('should not trigger resolve callback')
        }, () => {
          done()
        })
    })

    const yy = new YY({ init: true })
    yy.request({ url: 'my://hello' })
      .then((res) => {
        done()
      })
  })
})