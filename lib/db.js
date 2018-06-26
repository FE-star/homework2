const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options;
    this.hooks = {

    }
  }

  request() {
    // TODO
  }
}

module.exports = DB