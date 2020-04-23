# Unity扩展

Sein使用Unity来编辑场景、进行一些逻辑绑定，并通过扩展序列化到GlTF以及从GlTF反序列化回Unity，同时还支持非常方便的**实时预览**，来保证一致性。得益于Unity编辑器的强大，我们拥有了极大的灵活性，可以将Unity的很多特性对接到Sein。同时扩展还提供了强大的**自定义GlTF扩展**机制，可以让开发者定制自己需要的扩展，并支持在Unity导入和导出。

Sein提供了一个扩展来支持GlTF文件的导出和导入，并提供了一系列组件来使得Unity的对象支持Sein的功能。对于绝大部分Sein原生的自定Unity组件，不仅可以用扩展导出，也支持导入，达到比较完美的资源重用！

## 先开始

在最初，不妨先按照美术的教程先大概过一遍（即使你是开发者），来体会一下Unity扩展的强大：[写给艺术家的教程](../../tutorial/artist/preface)。

## 获取

目前有两种方式可以获取到SeinJSUnityToolkit。在这之前你需要先安装[Unity Personal Edition](https://store.unity.com/)。

### 通过CLI

如果你是通过[seinjs-cli](../intro)来初始化工程，那么在工程目录下的**unity**文件夹内找到**Assets/main.unity**，将其打开便进入默认场景，插件已经默认包含在了这个工程内，只需要在打开项目后双击**SeinJSUnityToolkit.unitypackage**导入即可。

### 自建工程

当然，你也可以自己建立Unity工程之后导入插件使用，插件可以在这里[SeinJSUnityToolkit](https://github.com/hiloteam/SeinJSUnityToolkit/tree/master/bin/SeinJSUnityToolkit.unitypackage)获取，之后双击导入即可。

## 基本功能

支持GameObject、模型、材质、纹理、动画（包括Transform、骨骼、Morph/BlendShape）、光源、摄像机、天空盒、图集、物理、音频、环境反射、环境照明、光照贴图的导出和导入，支持自定义扩展组件，支持脚本逻辑绑定，一些功能需要配合Sein的扩展组件完成。

### GameObject、模型和材质

一般需要配合下面扩展中的**Sein Scene Node**一起使用。导出的对象中相同的模型图元数据、材质和纹理会被合并，无需担心浪费资源。

### 骨骼和变形体

骨骼和变形体以及动画都是支持的。

## 纹理

支持纹理的导出，同时支持Unity中纹理的一些配置，比如`generateMipmaps`、`forcePOT`，以及是否输出`rgba4444`等。

>注意通过标准链路最终生成的纹理，默认都是`ReadOnly`的，也就是说会在资源提交GPU后销毁CPU端的内存，这可能导致`webgl context lose`后无法恢复。

### 光源

目前支持平行光、点光源和聚光，并支持由**Lighting Setting**中配置的环境光**Environment Lighting**转换为Sein中的环境光`AmbientLight`或`IBL`的漫反射。

>建议关闭**Lighting Setting**中的**Realtime Global Illuminatic**，来保证预览和最终效果的一致。

### 摄像机

目前仅支持基本配置，即**Transform**、**Projection**、**Field of View**、**Clipping Planes**。

### 天空盒

支持`Camera`组件上指定为纯色和天空盒两种模式的导出，天空盒支持`Skybox`材质中的**6 Sided**、**Cubemap**和**Panoramic**模式。

### 动画

需添加在顶层GameObject添加Unity的**Animator**组件，并保证在**Animation Controller**中所有需要添加的动画都存在。

### 物理

配合**Sein Rigid Body**和原生的碰撞体组件使用，详见后面的扩展介绍。

### 图集

配合**Sein Atlas**和**Sein Sprite**（也可以单独使用）使用，详见后面的扩展介绍。

### 音频

需要引入扩展`seinjs-audio`配合使用，详见[空间音频系统](../../extension/web-extensions/audio)。

### 光照贴图

Sein支持将Unity中的烘焙数据导出解析，详见[烘焙](../scene-editor/baking)。

### 环境反射

Sein支持将Unity中的环境反射效果完全导出解析，只需要勾选默认材质的`reflection`或使用`Sein/PBR`材质中选择反射类型，接下来的一切都会自动处理。

### 环境照明

Sein支持将Unity中的所有类型的环境照明导出，包括Skybox、渐变和纯色。
