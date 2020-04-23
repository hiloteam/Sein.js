# 烘焙

对于游戏这种实时渲染的场景，光照计算的开销无疑是巨大的，而对于端上Web场景更是如此——考虑到兼容性问题，在绝大多数情况下我们上个平行光已然不错、更别说点光源、实时阴影等等。而不仅仅是低端场景，对于大量的PC和主机游戏，一个场景中的光照如果完全实时计算也是不能承受得了的，为了在效果和性能间达到平衡，**光照贴图**技术应运而生。  

实时渲染，本质上是一种欺骗的技术，它利用各种各样的技巧来欺骗人眼，让用户以为看到了正确的东西——无论是三角面、法线贴图等都是如此，而光照贴图**LightMap**也是这样的一种技术。它使用离线渲染的方式，将复杂的**全局光照**信息预先计算，之后保存到一张特殊的贴图中（现在一般是HDR贴图，存的float数据，比如EXR、HDR等格式，但在Sein中目前只支持PNG格式的贴图，效果可能有些差异，后续会跟进），之后在运行时只需要采样纹理便可以得到预先存储的光照信息。  

由于离线渲染的特性，所以光照贴图技术只能用于那些完全静态的物体，一般而言是场景中那些不回变更的对象，比如房屋地面和墙壁、不会更改的家具比如床和橱柜等等。

Sein可以借助Unity的烘焙系统生成结合ao和lighting、shaodw信息的LightMap，再用内核集成的GlTF扩展`Sein_renderer`来解析，完成LightMap的应用。

## 在Unity中烘焙

在Unity中烘焙的详细介绍可见官方文档[Lightmapping](https://docs.unity3d.com/Manual/Lightmapping.html)，但这里我指出一条足以应对绝大多数场合的方法，帮助上手。

## 首先

如果要使用烘焙，为了保证和Sein最终效果的几乎一致性，请务必使用**线性工作流(Linear workflow)**！具体设置方法是**File -> Build Settings -> Player Settings(左下角) -> Inspector -> Other Settings -> Rendering => Color Space**改为**Linear**。

### 构建场景

首先让我们新建一个场景，向里面添加一些基础的几何体并添加材质（**一定要指定材质！不能新建时默认的材质。**）：

![Scene1](/assets/guides/assets/baking/1.png)  

如图，我的例子中添加了几个基本几何体，给它们赋予了默认材质，并且添加了默认的平行光（注意调整一下平行光的颜色为纯白）。这时在Unity中实时渲染的效果就是图里这样的。

### Light Setting

接下来让我们选中**Window -> Rendering -> Light Setting**选单：  

![LightSetting](/assets/guides/assets/baking/2.png)  

先将其中的环境光照`Environment Light`中所有选项进行调整，关掉环境光功能（目前Sein暂不支持IBL）：  

![EnvironmentLight](/assets/guides/assets/baking/3.png)  

之后关闭实时全局照明，开启烘焙并设置`LightingMode`为`ShadowMask`：  

![LightingMode](/assets/guides/assets/baking/4.png)  

至此，你应该可以看到现在的场景和之前基本完全不同，这也是接近最终渲染效果的：  

![Scene2](/assets/guides/assets/baking/5.png)  

### 开启物体烘焙选项

之后让我们回到场景中，调整每个3D物体中的`Mesh Renderer`组件选项，将其设为`Lightmap Static`：  

![LightmapStatic](/assets/guides/assets/baking/6.png)  

之后进入选单**Window -> Rendering -> Light Explorer**，设置其中的每一个光源的`Mode`为`Baked`，如此一来此灯光将不会对场景有实时影响，你调整它的属性也没办法实时生效，所以可以根据实际情况进行调整：  

![LightExplorer](/assets/guides/assets/baking/7.png)  

这时候Unity应该会开始自动烘焙，并且编辑器右下角应该会出现一个进度条（因为默认开启了`Auto Generate`），没关系，让我们先看看默认情况下烘焙的具体效果：  

![SceneBaked1](/assets/guides/assets/baking/8.png)  

是不是感觉有点粗糙？没关系，下面让我们看看如何优化。

### 烘焙

首先再次进入**Light Setting**选单，对其参数进行调整，一般而言，我们需要开启**环境光遮蔽（Ambient Occlusion）**，并关闭压缩（Compress Lightmaps），然后根据需求调整解析度**Lightmap Resolution**、间隙**Lightmap Padding**和贴图分辨率**Lightmap Size**（不超过2048，最好不超过1024）即可。同时我们可以按需关闭**Auto Generate**开关，防止每次自动从烘焙，而是手动触发（烘焙比较耗时）。  

>注意，Unity不支持将高光信息烘焙到lightmap中，只能通过将光源设置为`Mixed`模式，这依赖于Unity的Runtime实现高光，为了避免初始结果和最终结果的不一致，你有两个：  
>
>1. 你确实需要高光，则必须将光源的`Mode`设置为`Mixed`，并在**Light Setting**中的**Mixed Lighting**选项中的**Lighting Mode**选择`Shadowmask`模式，之后在导出时**将光源一并导出**，这将会有显著的性能开销，在移动设备慎用。
>2. 不需要高光，那么直接将材质中的特定选项关掉即可（比如默认PBR材质的**Forward Rendering Options -> Specular Highlights**）。

针对上面说到的粗糙的问题，我们有两个方法来解决：

1. 增加解析度和贴图尺寸，这种方法是全局的或者增加产物大小，一般不建议使用。  
2. 回到每个物体的`Mesh Renderer`配置，修改它们的`Scale in Lightmap`选项，设定改物体在LightMap中占据的空间。比如在此例中，下方的大平面（名字为Cube）显然面积更大，需要更大的空间来存储光影数据，所以我们可以将其的`Scale in Lightmap`调整为2，便可以达成目的。

经过优化后再点击**Generate Lighting**即可进行再次烘焙，最终结果如下：  

![SceneBaked2](/assets/guides/assets/baking/9.png)  

是不是好多了？

### 重置

如果觉得不满意想重新调整，可以直接点击**Generate Lighting**旁边的小三角下的菜单，选择**Clear Baked Data**即可。

### 导出

烘焙结束后便是导出，让我们通过**SeinJS -> Export to GlTF**打开选单，选择要导出的对象直接点击**Export**即可。在有些情形下你可能不希望导出光照贴图，此时只需要关闭**Options -> Export LightMap**开关即可。

>如果有报错，可以先把**碰撞体**都移除掉，在Sein中它依赖于`Sein Rigid Body`。

这里有一个例子，可以查看烘焙后的结果（没有实时光源）——[烘焙](../../example/light/baking)。

### 注意

由于Unity的LightMap默认存储在UV2中，所以如果你是使用模型进行烘焙，那么有两个选择——在建模时就展开第二套UV数据，添加第二个UV通道；要么在导入Unity时让其帮你生成。  

如果选择第二种方式，那么如果是FBX等模型，在导入设置中有`Generate LightMap UVs`，勾选了ReImport即可；如果使用**SeinJS -> Import GlTF**，那么只需要将导入窗口的`Generate LightMap UVS to Channel 2`选项勾选即可。

<!-- 对于**透明材质**， -->

## 使用

使用上和普通模型资源一样，加载后实例化即可，但注意你至少要添加一个环境光提供基准亮度（亮度可调节，但一般建议为黑色）：  

```ts
game.world.addActor('light', Sein.AmbientLightActor, {
  color: new Sein.Color(0, 0, 0),
  amount: 1
});
```

### 在运行时修改

当然，你也可以在运行时对光照贴图进行修改，对于`PBRMaterial`，只需要简单的设置`material.setUniform('lightMap', ...)`即可；对于自定义的派生自`RawShaderMaterial`或者`ShaderMaterial`的材质，约定`u_lightMap`字段为光照贴图的Uniform，对于使用者只需要`material.setUniform('u_lightMap', ...)`，对于材质的编写者则要注意——`lightMap`纹理资源中的`uv`属性代表现在光照贴图使用的UV通道，这个如何解决看开发者权衡。
