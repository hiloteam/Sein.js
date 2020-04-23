# 开发体系

为了最大程度得将游戏业界的思想和工程化方法引入前端开发，Sein做出了许多借鉴、整合和创造，来满足从小到大各种规模的互动工程的开发和维护。其主要以glTF文件为核心，依托于Unity作场景编辑、Webpack作为打包控制，辅以CLI、VSCode扩展、Inspector等，拥抱标准，提供了丰富的能力和简单的使用方式：

<img src="/assets/guides/assets/workflow/0.png" style="width: 90%;min-width: 1000px;"></img>

基于这个开发体系，我们提供了非常简洁的工作流：

<img src="/assets/guides/assets/workflow/1.png" style="width: 100%;min-width: 1000px;"></img>

目前版本，我们提供了非常易于使用的预览功能：

<video style="max-width: 100%;" src="/assets/tutorials/artist/img/0.mp4" controls></video>

>如果你还没有看过“开始”教程，建议先过一遍来实际体会一下整体流程——[开始](../tutorial)

## CLI

Sein提供了一个命令行工具**seinjs-cli**来帮助开发者高效初始化工程，你可以通过`npm i seinjs-cli -g`来安装它，其提供了两种模式来初始化一个项目：  

### New

直接执行`sein new`并按照指引输入一些选项，之后后即可在一个空目录创建一个全新Sein工程，你只需要执行`npm i`安装完依赖，之后在执行`npm run dev`，便可在浏览器内打开`localhost:8888`来直接访问默认模板提供的样例。  

>根据不同的模板和容器内容会有一些差异，下面以`simple`模板和`none`容器为例。

新工程的目录结构如下：

1. src: 源代码目录，里面存储着实际的代码逻辑和资源文件。
2. unity: 由于一些原因，Sein使用Unity配合GlTF导入导出插件来进行场景的组织管理，你可以先到[Unity官网](https://store.unity.com/)去下载并安装Unity的Personal版本，之后直接打开**unity/Assets/main.unity**即可打开默认场景，**SeinJSUnityToolkit**已经存在于其中。

接着细分**src**目录：

1. assets: 存储静态资源，在开发过程中你可以直接使用`/assets/${path-to-your-resource}`来访问此目录下的资源，在发布后也会保留这个目录和`index.html`的相对地址。
2. game: 游戏代码目录，存放着实际的游戏逻辑代码。
3. index.tsx/index.ts/index.vue: 工程入口文件，根据选择的引擎会有不同的格式。
4. base.scss: 默认DOM样式，工程默认使用**Scss**来编写样式，你也可以自己配置webpack文件来支持更多。

细分**game**目录（以Simple模板为例，每个模板各不相同）：

1. components: 组件目录，用于存放公共组件。
2. scripts: 脚本目录，用于存放世界玩法逻辑脚本`GameModeActor`和关卡脚本`LevelScript`。
3. states: 状态目录，用于存放各种状态，比如游戏状态`GameState`。

你也可以根据状况新建目录，比如后续可能添加的**玩家系统逻辑**。

### Merge

执行`sein merge`可以为现有的前端工程添加Sein的能力，你可以根据自己的情况输入后续选项，比如项目源代码目录、静态资源目录等，执行完毕后你的项目下将会多出以下几个目录：  

1. ${path-to-assets}/gltfs: GlTF模型资源目录。
2. ${path-to-src}/game: 游戏代码目录，存放着实际的游戏逻辑代码。
3. ${path-to-root}/unity: Unity工程目录。

以上每个目录的功能与`sein new`生成的目录完全一致。与此同时，CLI还会在你的**package.json**中自动追加需要的依赖，在执行`npm i`安装完必要依赖后，你便可以在需要加载游戏场景的代码文件中写入`import {main} from '${your-source-path}/game`引入游戏入口，之后使用`const game = main(canvas)`进行游戏的初始化了。

>Note: 不要忘了在必要时使用`game.destroy();`进行销毁，避免内存泄漏！

### 发布

完成上面的初始化后，你可以直接使用`npm run build`来尝试打包代码，最终的代码和资源文件会全部被打包到`dist`目录下。

### 模板和容器

CLI本身提供了模板和容器选择的选项，我们将不断更新维护模板和容器，来让它适合于更广大的场景，有关扩展模板和容器的更多详情，请见[扩展](../../extension)。

## Unity扩展

Sein使用Unity(提供扩展)来进行场景布置、脚本绑定，同时引入了Unity的很多易用强大的功能如烘焙能力的接入，你可以查看**[使用Unity扩展](../scene-editor/unity-extension)**一节获取更多内容。

## VSCode扩展

VSCode扩展用于降低开发成本，提升开发体验，目前支持通过基类快速创建类的能力，后续还会追加更多更丰富的功能，你可以在[SeinJSVSCodeExtension](https://marketplace.visualstudio.com/items?itemName=dtysky.seinjs)这里获取它。

<video src="/assets/guides/workflow/vsc.mp4" style="width: 100%" controls></video>

## Inspector

Inspector（尚在开发完善）提供了丰富的能力，比如获取Runtime的一些信息、可视化世界中的内容等，上面的那个预览的视频中，右侧的就是Inspector。

## Webpack Loader & Plugin

Sein也提供了一些Webpack的Loader和Plugin来在构建流程中对模型加载、平台适配等提供支持。

### seinjs-gltf-loader

提供在Webpack流程中，加载gltf/glb文件的功能。支持模型压缩、纹理压缩、转换Base64、打包glb、发布CDN、资源预处理等功能，拥有丰富的定制化配置，可以满足各种需求。

详细请见[seinjs-gltf-loader](../../extension/toolchains/seinjs-gltf-loader)。

### seinjs-atlas-loader

提供将Sein支持的Atlas格式引入Webpack流程的能力，提供发布CDN、资源预处理功能。

详细请见[seinjs-atlas-loader](../../extension/toolchains/seinjs-atlas-loader)。

### seinjs-url-loader

提供将其他资源加入Webpack流程的能力，提供发布CDN、资源预处理功能。

详细请见[seinjs-url-loader](../../extension/toolchains/seinjs-url-loader)。

### seinjs-platform-webpack-plugin

通过一个扩展自动化适配小程序、小游戏等平台，基本已经完成。

详细请见[seinjs-platform-webpack-plugin](../../extension/toolchains/seinjs-platform-webpack-plugin)。

### seinjs-png-compress-processor

PNG图片压缩处理器，和Tinypng一致的能力，依赖于seinjs的loaders。

详细请见[seinjs-png-compress-processor](../../extension/toolchains/png-compress-processor)。

## 资源发布CDN

如果你想把模型资源发布到CDN，可以参见[资源发布CDN](../../extension/toolchains/resource-publisher)。
