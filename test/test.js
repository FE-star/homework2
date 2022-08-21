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

        this.hooks.endpoint.tapPromise('endpoint', function () {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({ retcode: 0, res: { msg: 'hello world' } })
            }, 0)
          })
        })
      }
    }

    const xx = new XX({})
    xx.request().then(res => {
      assert.equal(res.res.msg, 'hello world')
      done()
    })
  })

  it('可以根据不同的options，使用不同的endpoint', function (done) {
    class AA extends DB {
      constructor(options) {
        super(options)

        /* 
          梳理一下流程：
          1. 第一次请求时，type为1，会先执行endpoint1，将{ retcode: 1, msg: 'logout' }传递给endpoint2
          2. endpoint2接收到{ retcode: 1, msg: 'logout' }后，走else逻辑，将其传递给第一次请求的then回调
          3. 发出第二次请求，type为0，先执行endpoint1，走else逻辑，将{ type: 0 }传递给endpoint2
          4. endpoint2接收到{ type: 0 }，会将{ retcode: 0, res: { msg: 'hello world' } }传递给第二个then回调
        */

        this.hooks.endpoint.tapPromise('endpoint1', function (options) {
          if (options.type === 1) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({ retcode: 1, msg: 'logout' })
              }, 0)
            })
          } else {
            // AsyncSeriesWaterfallHook需要将返回值传递给下一个函数
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(options)
              }, 0)
            })
          }
        })

        this.hooks.endpoint.tapPromise('endpoint2', function (options) {
          if (options.type === 0) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({ retcode: 0, res: { msg: 'hello world' } })
              }, 0)
            })
          } else {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(options)
              }, 0)
            })
          }
        })
      }
    }

    const aa = new AA()
    // 如果 options.type === 1，则返回第一个答案
    aa.request({ type: 1 })
      .then(res => {
        assert.equal(res.retcode, 1)
        // 如果 options.type === 0，则返回第二个答案
        return aa.request({ type: 0 })
      })
      .then(res => {
        assert.equal(res.retcode, 0)
        done()
      })
  })

  it('可以设置options插件来处理options', function (done) {
    class YY extends DB {
      constructor(options) {
        super(options)
        this.hooks.options.tap('options', options => {
          // modify options
          options.flag = true
          return options
        })
        this.hooks.endpoint.tapPromise('endpoint', options => {
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
    yy.request({ url: 'my://hello' }).then(res => {
      done()
    })
  })

  it('可以设置多个options插件', function (done) {
    class BB extends DB {
      constructor(options) {
        super(options)
        this.hooks.options.tap('options', options => {
          // modify options
          options.flag = true
          return options
        })
        this.hooks.options.tap('options', options => {
          // modify options，后面的覆盖前面的
          options.flag = false
          return options
        })
        this.hooks.options.tap('options', options => {
          options.url = 'you://hello'
          return options
        })
        this.hooks.endpoint.tapPromise('endpoint', options => {
          // init
          assert.equal(options.init, true)
          // merge
          assert.equal(options.url, 'you://hello')
          // options plugin modify
          assert.equal(options.flag, false)

          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve({ retcode: 0, res: { msg: 'hello world' } })
            }, 0)
          })
        })
      }
    }

    const bb = new BB({ init: true })
    bb.request({ url: 'my://hello' }).then(res => {
      done()
    })
  })

  it('可以通过judge插件判断返回是否正确', function (done) {
    class CC extends DB {
      constructor(options) {
        super(options)

        this.hooks.endpoint.tapPromise('endpoint', function (options) {
          if (options.type === 1) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({ retcode: 1, msg: 'logout' })
              }, 0)
            })
          } else {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(options)
              }, 0)
            })
          }
        })

        this.hooks.endpoint.tapPromise('endpoint', function (options) {
          if (options.type === 0) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({ retcode: 0, res: { msg: 'hello world' } })
              }, 0)
            })
          } else {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(options)
              }, 0)
            })
          }
        })

        this.hooks.judge.tap('judge', function (res) {
          // retcode为0表示请求成功
          // 如果没有注册judge hook，会将res直接返回
          return res.retcode === 0
        })
      }
    }

    const cc = new CC()
    cc.request({ type: 0 })
      .then(res => {
        assert.equal(res.res.msg, 'hello world')
        return cc.request({ type: 1 })
      })
      .then(
        res => {
          done(
            new Error('不应该进入正确回调，应当进入失败回调，因为retcode为1')
          )
        },
        res => {
          assert.equal(res.retcode, 1)
          assert.equal(res.msg, 'logout')
          done()
        }
      )
  })

  it('可以reject数据', function (done) {
    class ZZ extends DB {
      constructor(options) {
        super(options)

        this.hooks.endpoint.tapPromise('endpoint', function () {
          return new Promise((resolve, reject) => {
            reject()
          })
        })
      }
    }

    const zz = new ZZ()

    zz.request().then(
      () => {
        done(new Error('should not trigger resolve callback'))
      },
      () => {
        done()
      }
    )
  })
})
