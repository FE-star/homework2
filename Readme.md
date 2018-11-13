# 作业

> 8.15更新，更加详尽的测试用例

### 目的

> 学会插件系统 [tapable](https://github.com/webpack/tapable) ，并根据插件系统，定制出自己的请求库

### 注意

大家可以选择 tapable@0.2，也可以选择 tapable@1.x，这个看大家个人喜好哈，虽然我用的是0.2



https://juejin.im/post/5be90b84e51d457c1c4df852
https://webpack.docschina.org/api/tapable/
https://www.cnblogs.com/QH-Jimmy/p/8036962.html

```js
exports.__esModule = true;
exports.Tapable = require("./Tapable");
exports.SyncHook = require("./SyncHook");
exports.SyncBailHook = require("./SyncBailHook");
exports.SyncWaterfallHook = require("./SyncWaterfallHook");
exports.SyncLoopHook = require("./SyncLoopHook");
exports.AsyncParallelHook = require("./AsyncParallelHook");
exports.AsyncParallelBailHook = require("./AsyncParallelBailHook");
exports.AsyncSeriesHook = require("./AsyncSeriesHook");
exports.AsyncSeriesBailHook = require("./AsyncSeriesBailHook");
exports.AsyncSeriesWaterfallHook = require("./AsyncSeriesWaterfallHook");
exports.HookMap = require("./HookMap");
exports.MultiHook = require("./MultiHook");
```