# seinjs-platform-webpack-plugin

通过一个扩展自动化适配小程序、小游戏等平台，经过了一系列适配，目前基本已经完成。

## 使用

先安装：

```bash
npm i seinjs-platform-webpack-plugin --save-dev
```

之后在webpack.config.js之中添加配置(如果你走的是seinjs-cli通过**sein new**，并且容器选择小程序/小游戏则已经默认配好了)：

```js
plugins: [
  // 通过platform配置不同的平台，目前支持阿里小程序`my-tiny-program`和阿里小游戏`my-tiny-game`。
  new SeinJSPlatformPlugin({platform: 'my-tiny-program'})
]
```
