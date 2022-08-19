let DB = require('../lib/db');
// just for the real answer, please ignore
// if (!DB.prototype.request) {
//   DB = require('../lib/.db')
// }
const assert = require('assert');

describe('DB', function () {
  it('可以设置options', function () {
    const options = {}
    const db = new DB(options)
    assert.equal(db.options, options)
  })

  it('可以设置endpoint插件，使得该请求用制定的方式处理', function (done) {
    const xx = new DB();
    xx.hooks.endpoint.tapPromise('endpointPlugin1', () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ retcode: 0, res: { msg: 'hello world' } });
        }, 0);
      })
    });
    xx.request()
      .then((res) => {
        assert.equal(res.res.msg, 'hello world')
        done()
      })
  })

  it('可以根据不同的options，使用不同的endpoint', function (done) {
    const aa = new DB();
    aa.hooks.endpoint.tapPromise('endpointPlugin2', (options) => {
      return new Promise((resolve) => {
        if (options.type === 1) {
          setTimeout(() => {
            resolve({ retcode: 1 });
          }, 0);
        }
        if (options.type === 0) {
          resolve({ retcode: 0 });
        }
      });
    });
    // 如果 options.type === 1，则返回第一个答案
    aa.request({ type: 1 })
      .then(res => {
        assert.equal(res.retcode, 1)
        // 如果 options.type === 0，则返回第二个答案
        return aa.request({ type: 0 })
      }).then(res => {
        assert.equal(res.retcode, 0)
        done()
      })
  })

  it('可以设置options插件来处理options', function (done) {
    const yy = new DB({ init: true });
    yy.hooks.options.tap('optionsPlugin1', (options) => {
      options.flag = true;
      return options;
    });
    yy.hooks.endpoint.tapPromise('endpointPlugin3', (options) => {
      assert.equal(options.init, true);
      assert.equal(options.url, 'my://hello');
      assert.equal(options.flag, true);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ retcode: 0, res: { msg: 'hello world' } })
        }, 0)
      });
    })
    yy.request({ url: 'my://hello' })
      .then((res) => {
        assert.equal(res.res.msg, 'hello world');
        done()
      });
  })

  it('可以设置多个options插件', function (done) {
    const bb = new DB({ init: true });
    bb.hooks.options.tap('optionsPlugin2', (options) => {
      options.flag = true;
      return options;
    });
    bb.hooks.options.tap('optionsPlugin3', (options) => {
      options.flag = false;
      return options;
    });
    bb.hooks.options.tap('optionsPlugin4', (options) => {
      options.url = 'you://hello';
      return options;
    });
    bb.hooks.endpoint.tapPromise('endpointPlugin4', (options) => {
      assert.equal(options.init, true);
      assert.equal(options.url, 'you://hello');
      assert.equal(options.flag, false);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ retcode: 0, res: { msg: 'hello world' } });
        }, 0);
      })
    })
    bb.request({ url: 'my://hello' })
      .then((res) => {
        done()
      })
  })

  it('可以通过judge插件判断返回是否正确', function (done) {
    const cc = new DB();
    cc.hooks.endpoint.tapPromise('endpoingPlugin5', (options) => {
      if (options.type === 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ retcode: 0, res: { msg: 'hello world' } })
          }, 0);
        });
      }
      if (options.type === 1) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ retcode: 1, msg: 'logout' })
          }, 0);
        });
      }
    });
    cc.hooks.judge.tap('judgePlugin1', (res) => {
      return res.retcode === 0;
    });
    cc.request({ type: 0 })
      .then((res) => {
        assert.equal(res.res.msg, 'hello world');
        return cc.request({ type: 1 });
      }).then((res) => {
        done(new Error('不应该进入正确回调，应当进入失败回调，因为retcode为1'));
      }, (res) => {
        assert.equal(res.retcode, 1);
        assert.equal(res.msg, 'logout');
        done();
      })
  })

  it('可以reject数据', function (done) {
    const zz = new DB();
    zz.hooks.endpoint.tapPromise('endpointPlugin6', () => {
      return new Promise((resolve, reject) => {
        reject();
      });
    });

    zz.request()
      .then(() => {
        done(new Error('should not trigger resolve callback'))
      }, () => {
        done()
      })
  })
})