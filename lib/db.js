const Tapable = require("tapable");

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options || {};
  }

  request(options = {}) {
    // TODO
    let newOpt = this.applyPluginsWaterfall("options", options);

    let end = this.applyPluginsBailResult(
      "endpoint",
      newOpt ? Object.assign({}, newOpt, { init: true }) : options
    );
    
    return end.then(res => {
      return new Promise((resolve, reject) => {
        let flag = this.applyPluginsBailResult("judge", res);
        if (flag) {
          reject(res);
        }
        resolve(res);
      });
    });
  }
}

module.exports = DB;
