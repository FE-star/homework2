const Tapable = require("tapable");

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options || {};
  }
  request(options = {}) {
    // TODO
    // apply options plugins
    let rootOptions = this.applyPluginsWaterfall(
      "options",
      Object.assign(this.options, options)
    );
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult("endpoint", rootOptions)
        .then(rst => {
          !this.applyPluginsBailResult("judge", rst)
            ? resolve(rst)
            : reject(rst);
        })
        .catch(rst => {
          reject(rst);
        });
    });
  }
}

module.exports = DB;
