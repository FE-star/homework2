const Tapable = require('tapable');

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options;
  }

  request(param = {}) {
    // TODO
    this.applyPlugins('options', this.options);
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult(
        'endpoint',
        Object.assign(param, this.options || {})
      ).then(
        res => {
          this.applyPluginsBailResult('judge', res)
            ? reject(res)
            : resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}

module.exports = DB;
