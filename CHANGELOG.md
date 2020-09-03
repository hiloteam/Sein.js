# Change Logs
## 1.5.16

1. 更新 Hilo3d 到 `1.15.8`
2. 增加 export Sein.Hilo3d

## 1.5.15

1. 更新 Hilo3d 到 `1.15.7`。

## 1.5.14

1. 通过特殊手段，支持了安卓不支持纹理采样LOD的问题。

## 1.5.13

1. 修复事件系统 once bug
1. 增加 TouchTrigger.needPreventDefault & TouchTrigger.needStopPropagation 配置

## 1.5.11

1. 修复特定场景下骨骼动画关节名称克隆问题。

## 1.5.10

1. 修复特定场景下骨骼动画问题。

## 1.5.9

1. 更新 Hilo3d 到 `1.15.1`。

## 1.5.8

1. `SceneComponent.cloneFromHiloNode` 增加了 clone `name`。

## 1.5.7

1. 完善了部分类型定义。

## 1.5.6

1. `SkeletalMeshComponent`暴露了骨架`skeleton`。

## 1.5.4

1. 修复了解析glTF文件中`CUBICSPLINE`模式下的旋转动画插值问题。

## 1.5.3

1. 修复了特定场景下Morph动画的播放问题。

## 1.5.2

1. 为glTF中为脚本绑定的初始化参数，添加了内置的`Material`类型支持，需要Unity扩展`1.2.4`版本以上支持。

## 1.5.1

1. 为`SkeletalMeshComponent`添加了`changeSkin`方法，可以直接保留骨架修改蒙皮，一般用于换装。

## 1.5.0

1. 为`SkeletalMeshComponent`添加了`changeSkeleton`方法，可以复用骨架，一般用于换装。

## 1.4.48

1. 为`PrimitiveComponent`和`SpriteComponent`添加了`preRender`方法用于预渲染（预编译Shader以及提交资源到GPU）来做优化，同时为`SceneActor`同样也添加了这个方法用于在Actor层面处理。
2. 在实例化glTF资源时，可以使用`preRender`选项来进行直接的预提交。

## 1.4.47

1. 物理系统支持了各种关节，包括`PointToPoint`、`Distance`、`Hinge`、`Spring`、`Lock`几种类型。

## 1.4.46

1. `Sein_textureImprove`扩展支持了`textureType`，用以指定纹理提交到GPU的内部类型。可配合Unity扩展或者`seinjs-gltf-loader`使用。

## 1.4.45

1. `SpriteMaterial`支持了雾。

## 1.4.44

1. 修复了一些类型问题。
2. 新增了`Game`初始化参数中的`gameMode`，用于在UC浏览器或内核中优化性能。

## 1.4.43

1. 修复了`inspectable`装饰器的问题。

## 1.4.42

1. 修复了一些类型问题。
2. 添加了一些谓词。

## 1.4.41

1. `CameraComponent`添加了`captureScreen`方法，用于截取画布。

## 1.4.40

1. 更好的事件管理器的异常链提示。
2. 修复了`Game`下移除`InfoActor`的BUG。

## 1.4.39

1. 添加了对glTF文件中`BasicMaterial`的解析。

## 1.4.38

1. 调整了从glTF实例化`Actor`时，初始化本地矩阵的顺序（到`onAdd`之前）。
2. 修复了碰撞体在`Actor`作为一个`Actor`子级，并且父级缩放时的问题。

## 1.4.37

1. 进一步优化极端情况下的纹理内存开销。

## 1.4.36

1. 优化渲染性能。

## 1.4.34

1. 修复了在反复暂停唤醒的情况下，`Ticker`的一个问题。

## 1.4.33

1. 修复了游戏唤醒的一个问题。

## 1.4.32

1. 修复了一些遗留问题。

## 1.4.31

1. 更新了工程配置，将`Hilo3d`输出为非压缩格式。
2. 添加了`HTTP`模块的类型。

## 1.4.30

1. 添加了`ContextSupports`对象，用于检测上下文支持，目前支持`isWebGLSupport`的检测。

## 1.4.28

1. glTF文件中的自定义参数支持`Atlas`和`CubeTexture`类型。
2. `SpriteComponent`支持自定义材质，同时支持glTF文件中的自定义材质。

## 1.4.26

1. 对渲染引擎做了一些优化。
2. `Tween`的`onUpdate`中第一个参数改变为插值后的`delta`。

## 1.4.24

1. `ChildActorComponent`增加了`parent`支持，可以将其节点设置为一个指定的组件。

## 1.4.23

1. 修复了一些模型实例化的遗留问题。

## 1.4.22

1. 修复了`Sprite`的公告牌模式在节点嵌套时失效的问题。

## 1.4.21

1. 修复了glTF中`Atlas`对的压缩纹理的支持。

## 1.4.19

1. 优化了GLB资源的持久化内存占用。

## 1.4.18

1. 修复了`Sein_cubeTexture`、`Sein_atlas`扩展在GLB中解析的问题。

## 1.4.17

1. 支持了可选的`Texture`在提交GPU后是否释放CPU端内存的选项。
2. 通过`Sein_textureImprove`扩展，支持了指定glTF中文件的纹理是否在提交GPU后自动释放。

## 1.4.16

1. 添加了手动释放`AMC`解压内存的接口。

## 1.4.14

1. 添加了压缩纹理在GLB文件中的支持。

## 1.4.13

1. 为glTFLoader添加了针对于`url`的`cache`，防止不同`name`同一`url`的资源重复加载。
2. 资源加载器的`url`支持了函数，用于某些特殊的场景，大幅增加灵活性。

## 1.4.12

1. 添加了`CameraComponent`对天空盒的支持，以`backgroundMat`为接口实现。
2. 实现了`SkyboxMaterial`，作为默认的天空盒材质，支持纯色、立方体、全景三种模式。
3. 实现了glTF扩展`Sein_cubeTexture`，支持立方体纹理。
4. 实现了glTF扩展`Sein_skybox`，支持天空盒。
5. 修改了glTF扩展`Sein_imageBasedLighting`，增加了2D环境纹理支持。

## 1.4.11

1. 调整了装饰器`inspectable`的实现，使其更加具有合理性。

## 1.4.10

1. 修复了一些类型定义。
2. 为`seinjs-inspector`做支持，加入了装饰器`inspectable`，来标注需要被检视的属性。

## 1.4.9

1. 修复了一些`Tween`的类型定义。
2. 修正了`RawShaderMaterial`的默认混合模式。

## 1.4.8

1. 为`SpriteMaterial`增加了直接的透明度支持，并默认开启混合。

## 1.4.7

1. 修复了一些类型定义问题。
2. 解决了图集打包GLB无法解析的问题。

## 1.4.6

1. 支持了基于UnityToolkit全新的Atlas -> Sprite工作流。
2. 添加了`Sein_atlas`的支持，用于在glTF中支持图集。
3. 添加了`Sein_sprite`的支持，用于在glTF中支持`Sprite`。
4. 添加了一种全新方式，支持`Sein_customMaterial`将**UMD + ES5**形式的材质脚本内嵌到glTF中并加载使用了。

## 1.4.5

1. 修复了`Sein_imageBasedLighting`扩展中只有SH没有高光时的解析错误。

## 1.4.4

1. 修正了PBR材质中`Lightmap`也需要环境光才生效的问题。
2. `AtlasManager`中获取单帧纹理时，创建纹理的优化。

## 1.4.3

1. 修改了`AtlasManager`获取单帧纹理的方式，不再创建多个Canvas。

## 1.4.2

1. 修复了`EventManager`中某个事件监听器个数错误的问题。

## 1.4.1

1. 修复了`Observable`触发截断的问题。

## 1.4.0

1. 修改了`Sein_ambientLight`扩展到全局。
2. 将`gammaCorrection`和`hdr`整合进了全局的`Sein_renderer`扩展。
3. Lightmap效果优化。

## 1.3.20

1. 添加了对获取`EventManager`中某个事件监听器个数的接口。

## 1.3.19

1. 优化了IBL反射的效果，修正了`Sein_imageBasedLighting`的定义方式。
2. 优化了IBL的SH环境照明效果。

## 1.3.18

1. 修复了`PrimitiveComponent`的一些问题。

## 1.3.17

1. 修复了加载绑定了脚本的模型时，`onInstantiate`执行两次的BUG。

## 1.3.16

1. 将`Sein`模块暴露到了`window`下。
2. `Engine`类增加了`GET_RUNNING_ENGINE`静态方法，用于从全局获取当前引擎实例。
3. `Game`类增加了`getRunningGame`方法，用于从`Engine`获取当前游戏实例。

## 1.3.15

1. 对于指定了`className`来绑定逻辑的glTF节点，如果对应的类尚为注册，以警告取代错误。
2. 修复了交错形式的图元数据解析`bound`不对的问题。

## 1.3.14

1. 添加了对新的`Sein_node`扩展中，初始化参数的支持。

## 1.3.13

1. 解决了交错形式的图元数据，在元素类型不同时渲染错误的问题。
2. 优化了glTF扩展`Sein_animator`的使用。

## 1.3.12

1. 为模型解压缩扩展添加了更加细致的配置支持。

## 1.3.11

1. 为`Game`添加了`paused`属性来判断游戏是否处于暂停状态。
2. 解决了事件系统在游戏暂停时，无法处理非立即事件（比如HID的事件）的问题。当游戏暂停时，所有非立即事件都会立即触发，而不是等待帧更新。

## 1.3.10

1. 修复了`AtlasManager`只有`image`时，`destroy`的问题。

## 1.3.9

1. 修复了`Texture`中`updateSubTexture`方法的问题。

## 1.3.8

1. 修复了一些类型问题。

## 1.3.7

1. 更新了一些类型定义。

## 1.3.6

1. 修复了`RawShaderMaterial`设置`uniform`时的一个BUG。

## 1.3.5

1. 对`ResourceLoader`增加了静态成员`FORMATS`，用于指定哪些资源加载器绑定的资源格式。
2. 为适配小程序做了一些操作。

## 1.3.4

1. 为`AtlasManager`的各种创建添加了空隙`space`配置，可以控制图集的图之间的间隔。
2. 为`EventManager`的`add`事件添加了第三个`priority`参数，来精确控制触发顺序。同时允许`handle`返回`true`来阻断事件触发流程。

## 1.3.3

1. 修复了`RawShaderMaterial`中Shader缓存的问题。
2. 为`AtlasManager`添加了动态分配和释放帧空间的能力（通过`allocateFrame`和`releaseFrame`），提供了`CREATE_EMPTY`静态方法来创建一个空的图集，同时对动态图集提供了`usage`属性来获取面积。

## 1.3.2

1. 修复了`RawShaderMaterial`中材质销毁的问题。

## 1.3.1

1. 修复了`Atlas.CREATE_FROM_GRIDS`方法生成的图集的问题。

## 1.3.0

1. `AtlasManager`修改，增加了静态方法`CREATE_FROM_TEXTURE`，来通过一个图片快速创建图集，意图统一所有类似于帧动画的格式。同时废弃了`getUV`方法，换成了`getUVMatrix`。
2. `SpriteMaterial`，不再支持从一个`Texture`和`cell`直接构建，全部转换为单个`Texture`或`AtlasManager`和`uvMatrix`控制。
3. `SpriteComponent`，匹配`SpriteMaterial`的修改。
4. `SpriteAnimation`，匹配`SpriteComponent`的修改，原先通过`Texture`和`cell`直接创建的动画，现在需要通过`AtlasManager`创建。

>这是一个**Break Change!**，注意逻辑兼容！！！可以参考[2D精灵动画](http://seinjs.com/cn/example/animation/2d-sprite)。

## 1.2.7

1. 类型修正。
2. 材质加入`unlit`属性，用于控制是否是无光照的，日后配合`KHR_materials_unlit`扩展使用。

## 1.2.6

1. AMC压缩方案去除对Blob API的依赖。

## 1.2.4

1. 修复了渲染层Shader语法的兼容性问题。

## 1.2.3

1. `AtlasLoader`支持绝对路径和Base64的图片。

## 1.2.2

1. 修复了`TouchTrigger`的事件注册后不会移除的BUG。

## 1.2.1

1. 支持了自定义材质的同时，还支持别的材质扩展。
2. 修复了SH解析问题。
3. 移除了对高光环境贴图的gamma预处理。

## 1.2.0

1. 添加了通过SH技术实现的环境漫反射。
2. 针对环境反射（IBL），实现了glTF扩展Sein_imageBasedLighting，并可与Unity扩展结合。

## 1.1.28

1. 修复了动画状态机中，播放途中立即播放另一个动画的逻辑错误。

## 1.1.27

1. 修复了动画状态机中循环时的逻辑错误。
2. 修复了动画状态机中`stop`后立即播放的逻辑错误。

## 1.1.26

1. 为多图元（材质）的的模型，添加了`getSubMesh`接口，用于特殊场合。

## 1.1.25

1. 为非从资源实例化的`SceneActor`也添加了`onInstantiate`生命周期的正常执行，统一。
2. 在`onInstantiate`调用前，确保当前的世界矩阵被更新。

## 1.1.23

1. 修复了UMD模块无法直接引入使用的问题。

## 1.1.22

1. 修复了工程性问题。

## 1.1.21

1. 修复了`ShaderMaterial`的缓存问题。

## 1.1.20

1. 修复了依赖引入失效的错误。

## 1.1.19

1. 修复了渲染层的一些问题。

## 1.1.18

1. 更新了渲染层的一些底层新特性。

## 1.1.17

1. 修正了一些类型定义。
2. 将HILO的`GLExtensions`和`GLCapabilities`导出。
3. 添加了`actor.findComponentByFilter`和`actor.findComponentsByFilter`方法。

## 1.1.16

1. 为物理拾取结果添加了`point`字段，其表明射线和碰撞体实际交点在世界空间的文位置。

## 1.1.15

1. 修复了物理刚体组件`mass`从0初始化后，设置其他质量无效的问题。
2. 修改了刚体`physicStatic`属性功能在`CannonPhysicWorld`中实现的方式，使其更加高效了。

## 1.1.14

1. 修复了部分类型定义问题。

## 1.1.13

1. 修复了生成的ts头的问题。

## 1.1.12

1. 修复了使用`Sein_customMaterial`，glTF实例化时材质`uniforms`类型错误的问题。

## 1.1.11

1. glTF实例化时增加`ignoreMaterialError`配置，用于忽略`Sein_customMaterial`的问题。

## 1.1.10

1. 修复了类型问题。

## 1.1.9

1. PBR和Basic材质增加了`premultiplyAlpha`字段用于控制是否在Shader中预乘alpha。

## 1.1.8

1. SeinCustomMaterial扩展增加了`renderOrder`支持。

## 1.1.7

1. 增加了对应于Unity两种Color Space Workflow(Gamma 和 Linear)的glTF扩展，由`Sein_Renderer`中的`gammaCorrection`控制，若在Unity中选择线性工作流则为`true`，默认`false`，建议走线性流程，尤其是使用Lightmap时在Gamma流程会有较大色差。

## 1.1.6

1. 修正了同个glTF文件中有多个相同的带有骨骼动画的模型的拷贝时，无法正确处理骨骼依赖的问题。

## 1.1.5

1. 渲染层修正了lightmap的计算问题。

## 1.1.4

1. 修复了部分类型定义。

## 1.1.3

1. 修复了`Morph`相关的实例化功能，使其正常运作。

## 1.1.2

1. 若加载的Mesh为Morph，则将其实例化为`MorphActor`或者`MorphComponent`。

## 1.1.1

1. 将`game.start`方法改为了异步，提供了一个保证世界和关卡加载完毕的方式。

## 1.1.0

1. 修改glTF模型实例化逻辑，使得设计更加符合一致性，同时提高性能，减小包体积。也可以让指定Class的时候可以有开发者完整控制各个流程的逻辑，也为后续的在glTF中自定义初始化参数做准备。
2. 修改了BSP系列Actor的类型定义，使其更加符合使用场景。
