let DB = require('../lib/db');
// just for the real answer, please ignore
// console.log('typeof DB.prototype.request', typeof DB.prototype.request);
if ( typeof DB.prototype.request != 'function') {
  DB = require('../lib/.db')
}
const assert = require('assert')

describe('DB', function () {
  it('可以设置options', function () {
    console.log('case 1');
    const options = {}
    const db = new DB(options)
    assert.equal(db.options, options)
  })

  it('可以设置endpoint插件，使得该请求用制定的方式处理', function (done) {
    console.log('case2');
    class XX extends DB {
      constructor(options) {
        super(options)

        this.plugin('endpoint', function () {
          return new Promise((resolve) => {
            console.log('xx Promise');
            setTimeout(() => {
              resolve({ retcode: 0, res: { msg: 'hello world' } })
            }, 0)
          })
        })
      }
    }

    const xx = new XX()
    console.log('new xx')
    xx.request()
      .then((res) => {
        console.log('xx resolve called:', res);
        assert.equal(res.res.msg, 'hello world')
        done()
      })
  })

  it('可以设置options插件来处理options', function (done) {
    console.log('case 3');
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


    const yy = new YY({ init: true })
    console.log('create yy');
    yy.request({ url: 'my://hello' })
      .then((res) => {
        done()
      })
  })
  it('可以reject数据', function (done) {
    console.log('case 4');
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
    console.log('create zz');
    zz.request()
      .then(() => {
        throw new Error('should not trigger resolve callback')
      }, () => {
        done()
      })
  })
})