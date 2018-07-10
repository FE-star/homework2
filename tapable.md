# Tapable

Tapable是一个小型库，允许你添加和应用插件到一个javascript模块。它可以被继承或混入其他模块。它类似于NodeJS的EventEmitter，专注于定制事件发射和操作。但是，除此之外，还Tapable允许您通过回调参数访问事件的“排放者”或“生产者”。

下面是翻译的github readme文档内容，可作个了解大概跳过。

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  AsyncParalleHook,
  AsyncParalleBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require('tapable')
```

## Usage

所有Hook构造函数都接受一个可选参数，这是一个参数名称列表作为字符串。

    const hook = new SyncHook(['arg1', 'arg2', 'arg3'])

最好的做法是在hooks属性中公开类的所有钩子：

```js
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newSpeed']),
      break: new SyncHook(),
      calculateRoutes: new AsyncParalleHook(['source', 'target', 'routesList'])
    }
  }
  // ...
}
```

其他人现在可以使用这些钩子：

```js
const myCar = new Car()

// Use the tap method to add a consument
myCar.hooks.break.tap('WarningLampPlugin', () => warningLamp.on())
```

需要传递名称来识别插件/原因。你可能会收到论点：

```js
myCar.hooks.accelerate.tap('LoggerPlugin', newSpeed => {
  console.log(`Accelerating to ${newSpeed}`)
})
```

对于同步钩子，tap是添加插件的唯一有效方法。异步钩子也支持异步插件：

```js
myCar.hooks.calculateRoutes.tapPromise('GoogleMapPlugin', (source, target, routesList) => {
  // return a promise
  return google.maps.findRoutes(source, target)
    .then(route => {
      routesList.add(route)
    })
})

myCar.hooks.calculateRoutes.tapAsync('BingMapPlugin', (source, target, routesList, callback) => {
  bing.findRoute(source, target, (err, route) => {
    if (err) return callback(err)
    routesList.add(route)
    // call the callback
    callback()
  })
})
// 您仍然可以使用同步插件
myCar.hooks.calculateRoutes.tap('CachedRoutesPlugin', (source, target, routesList) => {
  const cachedRoute = cache.get(source, target)
  if (cachedRoute) routesList.add(cachedRoute)
})
```
需要调用它们时声明这些钩子的类：

```js
class Car {
  // ...
  setSpeed(newSpeed) {
		this.hooks.accelerate.call(newSpeed);
	}

	useNavigationSystemPromise(source, target) {
		const routesList = new List();
		return this.hooks.calculateRoutes.promise(source, target, routesList).then(() => {
			return routesList.getRoutes();
		});
  }

	useNavigationSystemAsync(source, target, callback) {
		const routesList = new List();
		this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
			if(err) return callback(err);
			callback(null, routesList.getRoutes());
		});
	}
}
```

Hook将使用最有效的方式运行插件来编译方法。它根据以下内容生成代码：

* 已注册插件的数量（none, one, many）
* 注册插件的类型 (sync, async, promise)
* 使用的调用方法 (sync, async, promise)
* 参数的数量
* 是否使用拦截

这确保了最快的执行速度。

## Interception

所有Hook都提供额外的拦截API：

```js
myCar.hooks.calculateRoutes.intercept({
	call: (source, target, routesList) => {
		console.log("Starting to calculate routes");
	},
	register: (tapInfo) => {
		// tapInfo = { type: "promise", name: "GoogleMapsPlugin", fn: ... }
		console.log(`${tapInfo.name} is doing it's job`);
		return tapInfo; // may return a new tapInfo object
	}
})
```

call: (...args) => void

在触发挂钩时会触发对拦截器的调用。您可以访问hooks参数。

tap: (tap: Tap) => void

当插件进入钩子时，会触发向拦截器添加tap。提供Tap对象。点按对象无法更改。

loop: (...args) => void

向拦截器添加循环将触发循环钩子的每个循环。

register: (tap: Tap) => Tap | undefined

向拦截器添加寄存器将触发每个添加的Tap并允许修改它。

## HookMap

HookMap是带有钩子的Map的助手类

```js
const keyedHook = new HookMap(key => new SyncHook(['arg']))

keyedHook.tap('some-key', 'MyPlugin', arg => { /**/ })
keyedHook.tapAsync('some-key', 'MyPlugin', (arg, callback) => { /**/ })
keyedHook.tapPromise('some-key', 'MyPlugin', arg => { /**/ })

const hook = keyedHook.get('some-key')
if (hook !== undefined) {
  hook.callAsync('arg', err => { /**/ })
}
```

## Hook/HookMap interface

public

```js
interface Hook {
  tap: (name: string | Tap, fn: (context?, ...args) => Result) => void,
  tapAsync: (name: string | Tap, fn: (context?, ...args, callback: (err, result: Result) => void) => void) => void,
  tapPromise: (name: string | Tap, fn: (context?, ...args) => Promise<Result>) => void,
  intercept: (interceptor: HookInterceptor) => void
}

interface HookInterceptor {
	call: (context?, ...args) => void,
	loop: (context?, ...args) => void,
	tap: (context?, tap: Tap) => void,
	register: (tap: Tap) => Tap,
	context: boolean
}

interface HookMap {
	for: (key: any) => Hook,
	tap: (key: any, name: string | Tap, fn: (context?, ...args) => Result) => void,
	tapAsync: (key: any, name: string | Tap, fn: (context?, ...args, callback: (err, result: Result) => void) => void) => void,
	tapPromise: (key: any, name: string | Tap, fn: (context?, ...args) => Promise<Result>) => void,
	intercept: (interceptor: HookMapInterceptor) => void
}

interface HookMapInterceptor {
	factory: (key: any, hook: Hook) => Hook
}

interface Tap {
	name: string,
	type: string
	fn: Function,
	stage: number,
	context: boolean
}
```

受保护（仅适用于包含钩子的类）：

```js
interface Hook {
	isUsed: () => boolean,
	call: (...args) => Result,
	promise: (...args) => Promise<Result>,
	callAsync: (...args, callback: (err, result: Result) => void) => void,
}

interface HookMap {
	get: (key: any) => Hook | undefined,
	for: (key: any) => Hook
}
```

## MultiHook

一个帮助钩状类，用于将抽头重定向到多个其他钩子：

```js
const { MultiHook } = require("tapable");

this.hooks.allHooks = new MultiHook([this.hooks.hookA, this.hooks.hookB]);
```

---

读了文档后，大致有个了解了，不过对tapable还是很模糊，下面简单概括下

`Tapable`有四组成员函数

* plugin(name: string, handler: function)

这允许自定义插件注册到`Tapable`实例的事件中。这起到类似于 `on()`方法的EventEmitter，这是用于注册一个处理程序/侦听器当信号/事件发生 做一些事情

* apply(...pluginInstances: (AnyPlugin|function)[])

AnyPlugin 是一个具有方法的类（或是一个对象）apply，或只是一个带有注册码的函数。此方法仅适用于插件的定义，以便真正的事件侦听器可以注册到Tapable实例的注册表中

* applyPlugins*(name: string, ...)

Tapable实例可以使用这些函数将特定哈希下的所有插件应用。这组方法就像使用各种策略精心控制事件发射的`emit()`方法的EventEmitter

* mixin(pt: Object) 一种简单方法来将Tapable原型扩展为mixin而不是继承

不同的applyPlugins* 方法涵盖以下用例：

* 插件可以串行运行
* 插件可以并行运行
* 插件可以一个接一个运行，但从前一个插件获取输入 (瀑布)
* 插件可以异步运行
* 放弃保释运行插件：也就是说，一旦一个插件返回非插件undefined，跳出运行流程并返回该插件的返回。这听起来像once()的EventEmitter，但是是完全不同的。

## 例子

webpack的Tapable实例之一编辑器负责编译webpack配置对象并返回一个编译实例。编译实例运行时，将创建所需要的捆绑包。

```js
// node_modules/webpack/lib/Compiler.js
var Tapable = require('tapable')
function Compiler() {
  Tapable.call(this)
}
Compiler.prototype = Object.create(Tapable.prototype)
```

现在在编译器上编写一个插件

```js
// my-custom-plugin.js
function CustomPlugin() {}
CustomPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', pluginFunction)
}
```

编辑器在其生命周期的适当位置通过执行插件

```js
// node_modules/webpack/lib/Compiler.js
this.apply*('emit', options)
// 会把所有的插件都取下来，然后运行它们
```

## 参考文章

[Webpack 源码（一）—— Tapable 和 事件流](https://segmentfault.com/a/1190000008060440)
