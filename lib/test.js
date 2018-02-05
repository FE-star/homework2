const DB = require('./db.js')


class XX extends DB {
      constructor(options) {
        super(options)

        this.plugin('endpoint', function () {
          return new Promise((resolve) => {
            console.log('??')
            setTimeout(() => {
              console.log('set')
              resolve({ retcode: 0, res: { msg: 'hello world' } })
            }, 0)
          })
        })
      }
    }

    const xx = new XX()
    xx.request()
      .then((res) => {
        console.log(res.res.msg)
      })