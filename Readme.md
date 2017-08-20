# 作业

[![Build Status](https://travis-ci.org/mayufo/homework2.svg?branch=master)](https://travis-ci.org/mayufo/homework2)
[![Coverage Status](https://coveralls.io/repos/github/mayufo/homework2/badge.svg?branch=master)](https://coveralls.io/github/mayufo/homework2?branch=master)
> 8.15更新，更加详尽的测试用例

### 目的

> 学会插件系统 [tapable](https://github.com/webpack/tapable) ，并根据插件系统，定制出自己的请求库


### applyPlugins

```
applyPlugins('name', any...)
```

触发事件name,传入参数args,**并行**调用所有的注册在事件name上的函数


### applyPluginsWaterfall
```
applyPluginsWaterfall('name', init: any, args: any...)
```
触发事件name,**串行**调用注册在事件name上的处理函数，先入先出，最先执行的处理函数，传入init和args,后续的处理函数传入前一个处理函数的返回值和args,函数最终返回一个处理函数的返回结果



### applyPluginsAsync

```
applyPluginsAsync(
        'name',
        any...,
        callback: (err?: Error) -> void
    )
```

触发事件name,**串行**的调用注册在事件name上的处理函数（先入先出），倘若一个处理函数报错，则执行传入的`callback(err)`,后续的将不被执行，否则最后一个处理函数调用callback


### applyPluginsBailResult

```
applyPluginsBailResult('name', any...)
```

触发事件`name`,串行的调用注册在事件name上的处理函数（先入先出）传入参数args,其中如果一侧处理函数返回值不等于`undefined`,直接返回至二个返回值，后续的处理函数将不被执行


### applyPluginsAsyncWaterfall

```
applyPluginsAsyncWaterfall(
    'name'
    init: any,
    callback: (err: Error, result: any) -> void触发事件name,串行的调用注册在name上的处理函数（先入先出）第一个处理函数传入init,后续的函数依赖于前一个函数执行会掉的时候传入的参数nexValue,倘若某个处理函数报错，执行传入的callback(err),后续的处理函数将不被执行，否则最后一个处理函数调用callback(value)
)
```

### hasPlugins
```
hasplugins('name')
```

注册这个组件就返回true,没有false


const opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options))
                this.applyPluginsBailResult('endpoint', opts)
                .then(res => {
                    const hasError = this.applyPluginsBailResult('judge', res, opts)
                    if(hasError === true) {
                        res = this.applyPluginsWaterfall('error', res, opts)
                        reject(res);
                    } else {
                        res = this.applyPluginsWaterfall('suceess', res, opts)
                    }
            }, res => {
                    res = this.applyPluginsWaterfall('error', res, opts)
                    resject(res)
        })

        // return new Promise((resolve, reject) => {
        //     if (this.hasPlugins('options') && options) {
        //         this.options = Object.assign(options, this.applyPluginsWaterfall('options', this.options))
        //     } else {
        //         this.options = options || {}
        //     }
        //
        //     this.applyPluginsBailResult('endpoint', this.options).then(res => {
        //         if (this.hasPlugins('judge') && this.applyPluginsBailResult('judge', res)) {
        //             reject(res)
        //         }
        //         resolve(res)
        //
        //     }).catch(res => {
        //         reject(res)
        //     })
        //         // const opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options))
        //         // this.applyPluginsBailResult('endpoint')
        // })
