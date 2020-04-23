# 导出glTF

安装完插件后，应当可以在Topbar看到：  

![toolbar](/assets/guides/assets/unity/1.png)

点击其中的**Export to gltf**，即可唤出导出菜单：  

![export](/assets/guides/assets/unity/2.png)

## 注意

>如果你是通过CLI创建的则无需关心，可以跳过。

为了确保最终效果的一致性，请在使用的时候，请务必使用**线性工作流(Linear workflow)**！具体设置方法是**File -> Build Settings -> Player Settings(左下角) -> Inspector -> Other Settings -> Rendering => Color Space**改为**Linear**。  

同时，如果你需要导入贴图，请注意导入选项中的**SRGB(Color Texture)**选项，如果这张贴图是**基础颜色贴图(baseColor)**、**高光贴图(specular)**或**自发光贴图(Emission)**，请勾选，其他情况下务必去掉！当然，如果使用Toolkit进行GlTF的导入，扩展默认会处理好这些状况。  

>如果是Windows平台，请保证使用OpenGLCore渲染，**File -> Build Settings -> Player Settings(左下角) -> Inspector -> Other Settings -> Rendering**中关闭**Auto Graphics API for Windows**，之后添加**OpenGLCore**并将其排到第一位。如图：

![windows](/assets/guides/assets/unity/8.png)

## 材质

注意你模型使用的材质！目前为止，SeinJSUnityToolkit支持完全和端上一致的内置PBR材质**Sein/PBR**，<del>以及Unity标准材质（三种Standard材质，这标准材质本质上就是PBR的一种实现）<del>（已废弃，请使用内置的转换工具转换），所以请务必使用这些材质以防止导出错误！如果想使用无光照模型进行性能优化或者效果控制也可以用此材质达成。如果想把现在的Standard材质转换为**Sein/PBR**，Toolkit也提供了这个能力。详细的介绍请见[Unity中的Sein标准材质](../scene-editor/material-sein)。  

当然，目前你也可以使用`Sein_customMaterial`扩展使用在Sein运行时定义的材质，并在Toolkit中进行指定，以此来在GlTF文件中指定自定义的材质，详见下一节对应组件的介绍。  

对于其他模式自定义的材质，需要通过`KHR_techniques_webgl`实现，目前运行时已经支持此扩展，但Toolkit还在迭代中，尽请期待！

## 导出选项

在导出菜单中，有若干选项，它们的功能如下：

### Export Settings

用于导出的一些功能性全局配置。

1. Name：模型文件名字，会成为输出的gltf和bin文件的文件名，在`Split chunks`开关打开时无效。
2. Folder： 指定导出文件保存的目录，默认为Unity工程的Output目录，修改后将会由插件保存。**但注意每次导出前里面的内容会被清空！！！**
3. Split chunks：是否要分割输出的模型文件。
4. Export skybox：是否要输出天空盒。

配置**Split chunks**选项可以决定是否要分割模型。如果不分割，则会将所有的模型打包到一个场景（文件）中：  

![not-split](/assets/guides/assets/unity/4.png)  

如果选择分割，则每一个顶层节点都会生成一个单独的文件：  

![split](/assets/guides/assets/unity/5.png)  

### Normal Texture Settings

一般的纹理输出配置，这些纹理是指所有非HDR的纹理。

1. Opaque image type：不透明纹理输出的格式。
2. Transparent image type：透明纹理输出的格式。
3. Texture max size：指定纹理输出的最大尺寸。
4. Texture jpg quality：输出JPG格式时，压缩的质量。

### HDR Settings

HDR相关的而一些输出配置。

1. HDR Texture Encoding: HDR纹理编码类型，目前暂时只支持RGBD。

### CubeTexture Settings

立方体纹理的一些设置。

1. Texture max size: 默认立方体纹理最大尺寸限制。

### Lighting Settings

光照相关的一些配置。

1. Export ambient light：是否输出全局环境光，输出的话将会创建一个专用的`AmbientLightActor`或使用IBL扩展，能最大程度保证最终渲染效果和Unity的一致。
2. Export light map：是否要输出光照贴图，这个详见[烘焙](../scene-editor/baking)一章。
3. Light map max size：光照贴图输出的最大尺寸。
4. Export reflection：是否输出全局反射，详见下一节的**Sein_imageBasedLight**部分。
5. Reflection map max size：全局纹理输出的最大尺寸。

配置好参数后，选中你需要导出的模型节点，点击**Export**即可导出：

![selection](/assets/guides/assets/unity/3.png)

>如果不选中则会导出当前场景所有物体。

导出后会自动打开保存的目录。

你也可以直击点击**预览**来直接进行预览，详见[预览](../tutorial/artist/preview)。
