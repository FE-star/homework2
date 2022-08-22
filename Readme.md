# 作业

> 8.15更新，更加详尽的测试用例

### 目的

> 学会插件系统 [tapable](https://github.com/webpack/tapable) ，并根据插件系统，定制出自己的请求库

### 注意

大家可以选择 tapable@0.2，也可以选择 tapable@1.x，这个看大家个人喜好哈，虽然我用的是0.2

### 项目克隆至本地之后， npm install 、 npm run test 之后报如下错误
  Cannot start ChromeHeadless
  Can not find the binary C:\Users\唐明响\Desktop\前端进阶培训_极客时间\homework\homework2\node_modules\puppeteer\.local-chromium\win64-1022525\chrome-win\chrome.exe
  Please set env variable CHROME_BIN
  此时只需要将 karma.conf.js 配置文件中的
    process.env.CHROME_BIN = require('puppeteer').executablePath()  改为
    process.env.CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'  （即本地 Chrome 浏览器启动的路径即可）
  参考 https://www.npmjs.com/package/karma-chrome-launcher
