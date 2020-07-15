# 阿里小游戏容器

适配阿里小游戏的容器。

>小游戏由于是单canvas方法，所以降级特别简单，而且可以直接在浏览器中进行开发，最后在小游戏中进行验证，特别方便，同时性能也是最好的。但需要使用自绘UI系统[seinjs-gui](http://seinjs.com/cn/extension/common-extensions/gui)，在UI方面开发可能相对复杂，能力也比弱。

## 实例

<video style="max-width: 1000px" src="https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*1h3OTLkmczUAAAAAAAAAAABkARQnAQ" controls></video>

## 使用

Sein提供了两种方式来初始化一个小游戏项目：

>能力还未最终上线，目前可以用测试包开发，但最终可能会有些许修改。

### 从CLI初始化

最推荐的方法是使用CLI的`sein new`初始化工程，容器选择**my-tiny-game**，之后即可初始化好一个工程。

初始化后，你的目录结构应当大致如下（以**simple**模板为例，免去了工程脚手架文件）：

```txt
game
|----assets
|----components
|----scripts
|----states
dist
|----game.js
|----game.json
|----mini.project.json
web
|----index.ts
|----index.html
unity
|----Assets
|----ProjectSettings
```

其中**game**目录中的是游戏部分的代码，**dist**中的是小游戏的入口，**web**中的是用于在web端开发的入口，**unity**中的是Unity场景工程。

那么，这几个是如何串联起来的呢？前面说到过，目前的方案可能有一些迂回，下面就来大致说明一下流程。

### 开发

用CLI初始了项目后，要实现小游戏项目的开发（假设开发者已经在开放平台创建了对应的应用），需要走以下几步：

1. 运行`npm run dev-web`，直接在浏览器预览开发，可以使用浏览器的一切工具链。
2. 开发得差不多后，运行`npm run dev`，等待第一次构建完成。
3. 构建完成后，可以看到在**dist**目录下生成了一个`sein-game`的临时目录，这个目录存放的是游戏部分构建出的中间代码。
4. 用小程序IDE打开**dist**目录，使用工具的**预览**功能，推送到开发机上调试。

### 发布

发布和开发基本相似，只是要在使用小程序IDE上传发布前，先执行`npm run build`。
