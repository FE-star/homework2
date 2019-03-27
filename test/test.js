let DB = require('../lib/db')
// just for the real answer, please ignore
// if (!DB.prototype.request) {
//   DB = require('../lib/.db')
// }
const assert = require('assert');

describe('DB', function () {
    it('可以设置options', function () {
        const options = {};
        const db = new DB(options);
        assert.strictEqual(db.existingOptions, options);
    });

    it('可以设置endpoint插件，使得该请求用制定的方式处理', function (done) {
        const xx = new DB();

        xx.hooks.endpoint.tapPromise('MyCustomEndpoint', (options, result) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({retcode: 0, res: {msg: 'hello world'}});
                }, 0);
            }).then(res => {
                result.res = res;
                return res;
            });
        });

        xx.request()
            .then((res) => {
                assert.equal(res.res.msg, 'hello world');
                done();
            });
    });

    it('可以根据不同的options，使用不同的endpoint', function (done) {
        const aa = new DB();

        aa.hooks.endpoint.tapPromise('MyCustomEndpoint', (options, result) => {
            return new Promise(resolve => {
                let msg = '';
                if (options.type === 0) {
                    msg = 'hello world';
                } else if (options.type === 1) {
                    msg = 'logout';
                }
                setTimeout(() => {
                    resolve({retcode: options.type, res: {msg}});
                }, 0);
            }).then(res => {
                result.res = res;
                return res;
            });
        });
        // 如果 options.type === 1，则返回第一个答案
        aa.request({type: 1})
            .then(res => {
                assert.equal(res.retcode, 1);
                // 如果 options.type === 0，则返回第二个答案
                return aa.request({type: 0})
            }).then(res => {
            assert.equal(res.retcode, 0);
            done();
        });
    });

    it('可以设置options插件来处理options', function (done) {
        const yy = new DB({init: true});

        yy.hooks.options.tap('MyCustomOption', (options, existingOptions) => {
            Object.keys(options).forEach(key => {
                existingOptions[key] = options[key];
            });
            return true;
        });
        yy.hooks.endpoint.tapPromise('MyCustomEndpoint', (options, result) => {
            assert.strictEqual(options.init, true);
            assert.strictEqual(options.url, 'my://hello');
            assert.strictEqual(options.flag, true);

            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({retcode: 0, res: {msg: 'hello world'}});
                }, 0);
            }).then(res => {
                result.res = res;
                return res;
            });
        });

        yy.addOptions({flag: true});
        yy.request({url: 'my://hello'})
            .then((res) => {
                done();
            });
    });

    it('可以设置多个options插件', function (done) {
        const bb = new DB({init: true});

        // 只要定义过插件就会被跑
        bb.hooks.options.tap('MyCustomOption', (options, existingOptions) => {
            existingOptions.flag = true;
        });
        bb.hooks.options.tap('MyCustomOption', (options, existingOptions) => {
            existingOptions.flag = false;
        });
        bb.hooks.options.tap('MyCustomOption', (options, existingOptions) => {
            existingOptions.url = 'you://hello';
        });
        bb.hooks.endpoint.tapPromise('MyCustomEndpoint', (options, result) => {
            assert.strictEqual(options.init, true);
            assert.strictEqual(options.url, 'my://hello');
            assert.strictEqual(options.flag, false);

            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({retcode: 0, res: {msg: 'hello world'}});
                }, 0);
            }).then(res => {
                result.res = res;
                return res;
            });
        });

	    bb.addOptions();
	    bb.request({url: 'my://hello'})
            .then((res) => {
                done();
            })
    });

    it('可以通过judge插件判断返回是否正确', function (done) {
        const cc = new DB;
        cc.hooks.endpoint.tapPromise('MyCustomEndpoint', (options, result) => {
            return new Promise(resolve => {
                let msg = '';
                if (options.type === 0) {
                    msg = 'hello world';
                } else if (options.type === 1) {
                    msg = 'logout';
                }
                setTimeout(() => {
                    resolve({retcode: options.type, res: {msg}});
                }, 0);
            }).then(res => {
                result.res = res;
                return res;
            });
        });
        cc.hooks.judge.tap('MyJudge', (res, result) => {
            result.data = res.retcode !== 0;
        });

        cc.request({type: 0})
            .then((res) => {
                assert.equal(res.res.msg, 'hello world');
                return cc.request({type: 1});
            }).then((res) => {
            done(new Error('不应该进入正确回调，应当进入失败回调，因为retcode为1'));
        }, (res) => {
            assert.equal(res.retcode, 1);
            assert.equal(res.res.msg, 'logout');
            done();
        });
    });

    it('可以reject数据', function (done) {
        const zz = new DB;
        zz.hooks.endpoint.tapPromise('MyCustomEndpoint', () => {
            return new Promise((resolve, reject) => {
                reject();
            });
        });

        zz.request()
            .then(() => {
                done(new Error('should not trigger resolve callback'));
            }, () => {
                done();
            });
    });
});