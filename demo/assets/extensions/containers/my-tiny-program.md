# 阿里小程序容器

适配阿里小程序的容器。

>对阿里小程序的适配在当前时点下比较复杂，但我们正在和小程序IDE团队紧密联系，争取进一步降低整体的工程复杂度，实现完美的融合。

## 实例

目前小程序3D功能已经上线，用支付宝即可进入实例查看。

### 进入实例

>目前FrameBuffer尚未完美支持，所以部分例子（主要是PBR折射、进阶渲染、后处理）有问题。

扫码即可进入，扫码后点击左上角的齿轮可以唤起实例列表:

![demo](/assets/extensions/containers/my-tiny-program/0.png)

## 使用

Sein提供了两种方式来初始化一个小程序3D项目：

### 从CLI初始化

最推荐的方法是使用CLI的`sein new`初始化工程，容器选择**my-tiny-program**，之后即可初始化好一个工程。

初始化后，你的目录结构应当大致如下（以**simple**模板为例，免去了工程脚手架文件）：

```txt
game
|----assets
|----components
|----scripts
|----states
page
|----index.acss
|----index.axml
|----index.js
|----index.json
unity
|----Assets
|----ProjectSettings
app.acss|axml|js|json
```

其中**game**目录中的是游戏部分的代码，**page**中的是小程序的页面，**unity**中的是Unity场景工程。

那么，这几个是如何串联起来的呢？前面说到过，目前的方案可能有一些迂回，下面就来大致说明一下流程。

### 开发

用CLI初始了项目后，要实现小程序3D项目的开发（假设开发者已经在开放平台创建了对应的应用），需要走以下几步：

1. 执行`yarn install`，如果使用tnpm，可以`tnpm install --by=yarn`。
2. 运行`npm run dev`，等待第一次构建完成。
3. 构建完成后，可以看到在根目录下生成了一个`sein-game`的临时目录，这个目录存放的是游戏部分构建出的中间代码。
4. 用小程序IDE工具的**预览**功能，推送到开发机上调试（目前暂不支持在IDE内预览）。

通过以上三步，标准的模板工程应当正常运作，在进一步的开发过程中，你可能需要知道：

1. 游戏层代码和View层的逻辑交互，建议通过`game.event`进行事件通信，数据存储和管理放在游戏层，可以通过`GameState`实现。
2. 如果一定要在View层使用`Sein`，请用`const Sein = my.Sein`。

### 发布

发布和开发基本相似，只是要在使用小程序IDE上传发布前，先执行`npm run build`。

### 注意事项

在Sein中使用小程序，目前需要注意以下几点：

1. 如果你使用了`sein-gltf-loader`等将模型文件构建到了包内，请注意申请`FileSystemManager`的使用权限。
2. 如果需要强制横屏，也需要申请对应的权限：`my.call("setScreenOrientation", {orientation: 'landscape', beta: true});`，注意要在`app.js`的一开头调用。

### 加入现有工程

如果不想使用CLI，而是自行构建体系，当然也是可以的，但这样就需要自己去进行一系列的配置了：

1. Webpack配置，详见[seinjs-gltf-loader](../toolchains/seinjs-gltf-loader)、[seinjs-atlas-loader](../toolchains/seinjs-atlas-loader)、[seinjs-platform-webpack-plugin](../toolchains/seinjs-platform-webpack-plugin)。
2. Webpack中指定`outputPath`和`publicPath`为特定目录，并将设置`libraryTarget: 'commonjs2'`和`filename: 'index.js'`。
3. 在**app.json**中的`window`对象中，加入配置`"v8WorkerPlugins": ["gcanvas_runtime"]`。
4. 在**page./index.js**中引入构建后的目标文件，比如`import {main} from '../sein-game'`。
5. 安装Sein小程序专用组件`npm i seinjs-my-tiny-program-component`，之后在**page/index.json**中的`usingComponents`配置：`"seinjs": "seinjs-my-tiny-program-component/seinjs"`。
6. 在**page/index.axml**中使用`<seinjs onSeinCanvasCreated="onSeinCanvasCreated" />`，并在`page/index.js`中编写方法：

```js
onSeinCanvasCreated(canvas) {
  this.canvas = canvas;
  this.game = main(this.canvas);
  console.log('onSeinCanvasCreated', canvas);
}
```

完成。
