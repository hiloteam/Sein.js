# SEIN官方特性支持

Sein提供了一系列官方Unity组件或扩展来让开发者在GlTF中指定Sein中的功能。

## Sein_node

对应组件**Sein Scene Node**，用于将Unity的`GameObject`转换为Sein中的Actor或者Component，不需要每个都指定，一般而言只在关键的组件上指定即可。  

通过Sein_node组件，我们还可以进行逻辑脚本的绑定，通过简单的操作，便可以指定GameObject在Sein中对应的SceneActor/SceneComponent类，在实例化时完成自动绑定。详情见[在Unity中进行脚本绑定](../scene-editor/gltf-script-binding)。

![Sein_node](/assets/guides/assets/gltf-extension-official/1.png)  

1. Self Type: 当前节点将被实例化的类型，可指定为`Actor`或`Component`。若一个节点没有指定**Sein_node**，则其将会根据父级节点的**Children Type**来自动决定。
2. Children Type：当前节点的所有子级节点的默认实例化类型，除非子级节点自行添加**Sein_node**。但注意有两个特殊情况——一是在顶级父节点没有添加**Sein_node**的情况下，所有的节点都会被实例化为`Actor`；二是当一个节点的**Self Type**被指定为`Component`时，无论其子级节点的**Self Type**被指定为什么类型，都会强制被实例化为`Component`！
3. Class Name：（会被新的方法覆盖，详情见上面说的下一章）指定节点实例化时对应的类，这些类必须派生自`SceneActor`或`SceneComponent`，如果是拥有Mesh的模型节点，那么还必须派生自特例的类比如根节点是`StaticMeshComponent`的`Actor`。同时这些类必须被`SClass`装饰器进行正确的装饰以加入元数据，并且它们的初始化参数类型应当为空！
4. Tag：等价于`actor.tag`，指定标签。
5. Layers：等价于`actor.layers`，指定图层Mask。
6. Persistent：等价于`actor.persistent`，控制是否是持久的。
7. Emit Components Destroy：等价于`actor.emitComponentsDestroy`。指定实例化后的`Actor`在销毁时是否要触发挂载的组件销毁方法`onDestroy`，一般用于性能优化。
8. Update On Ever Tick：等价于`actor.updateOnEverTick`或`component.updateOnEverTick`，控制是否会在每一帧进行逻辑更新，性能优化。
9. Is Static：等价于`actor.isStatic`或`component.isStatic`。控制是否会在每一帧进行渲染更新，性能优化。
10. Skip This Node：是否要在实例化的时候跳过此节点，一般用于忽略**预制体Prefab**节点。

## Sein_physicBody

对应组件**Sein Rigid Body**以及原生的碰撞体组件。一般而言，使用了**Sein_physicBody**的节点一定是一个Actor。  
![Sein_physicBody](/assets/guides/assets/gltf-extension-official/2.png)  

1. Mass：对应`actor.rigidBody.mass`，指定刚体的质量。
2. Friction：对应`actor.rigidBody.friction`，指定刚体的表面摩擦力。
3. Restitution：对应`actor.rigidBody.restitution`，指定刚体的弹性系数。
4. Un Control：对应`actor.rigidBody.unControl`，指定刚体是否是不受控制的，即不从`Actor`向刚体同步Transform，用于性能优化。
5. Physic Static：对应`actor.rigidBody.physicStatic`，指定刚体是否是物理静止的，即不从刚体向`Actor`同步Transform，用于性能优化。
6. Sleeping：指定刚体是否初始化时就睡眠，用于性能优化。

Unity标准的碰撞体都会直接被转换为Sein中对应的`ColliderComponent`，注意目前Unity的碰撞体仅仅支持`BoxCollider`、`SphereCollider`，基于高度图的碰撞体`TerrainCollider`正在追加中！铰链支持也在追加中！  

>如果仅仅用于拾取，可以不添加**Sein Rigid Body**而仅仅添加碰撞体，扩展会自动生成适合此状况的对应组件。

## Sein_animator

对应组件**Sein Animator**。一般而言，使用了**Sein_animator**的节点一定是一个Actor。  

在最新版本的扩展中，你无需再手动添加`SeinAnimator`组件，直接使用Unity原生的`Animator`组件即可（注意`Animation`组件不再被支持）：

![Sein_animator](/assets/guides/assets/gltf-extension-official/3.png)  

由于GlTF会将一个场景的所有动画都存储在全局，所以需要**Sein_animator**扩展来帮助Sein明确一个节点下具体拥有哪些动画。使用这个组件就可以完美解决。

在当前的方案中，默认的动画是在`AnimatorController`里指定的：

![AnimatorController](/assets/guides/assets/gltf-extension-official/4.png)  

## Sein_customMaterial

对应组件**Sein Custom Material**。用于利用前面[材质](../render/material)章节说过的`SMaterial`装饰过的运行时定义的材质，以及具体的Uniform信息，为GlTF中的Mesh指定特殊材质。  

下面只是一种使用方式的简单说明，更加详细的说明，**也是更为推荐的方式**，请见[在Unity中指定材质](../scene-editor/material-extension)。  

![Sein_customMaterial](/assets/guides/assets/gltf-extension-official/5.png)  

1. Class Name：通过`SMaterial`装饰过的材质类的类名。
2. Unity Material Name：当具有多个材质时，指定该材质对应哪个Unity原始材质。
3. Clone For Inst：是否要在实例化的时候Clone出一个全新的材质，如果你的模型有材质动画并且这些动画不同步，则应当勾选。
4. Render Order：渲染顺序。
5. Uniforms：指定不同类型的Uniform，这些Uniforms的作用和材质类是强耦合的，可见实例[材质扩展](../../example/material/material-extension)。


## KHR_techniques_webgl

`KHR_techniques_webgl`扩展是一个标准扩展，其允许通过一些细节参数来完全从0指定一个材质，不需要依赖于`SMaterial`等，目前引擎端已然完美支持解析，Unity端的扩展也实现了一部分，可以让开发者将Unity中编写的材质导出到Sein使用，详见[使用Unity编写材质](./technique)。

>暂时废弃，请勿使用，自定义材质请使用上面的Sein_customMaterial！

## Sein_renderer

`Sein_renderer`扩展可以认为某种程度上对应于Unity的`Mesh Renderer`组件，Sein通过其为`PrimitiveComponent`提供了阴影和LightMap（光照贴图）能力，这使得Sein可以用Unity的烘焙系统来为静态物体做到离线光照和阴影信息的存储，来在运行时以极低的开销提供更好的效果，详情请看[烘焙](../scene-editor/baking)一章。

此外，全局的`Sein_renderer`扩展还将管理整个场景的`gammaCorrection`和`HDR`。

## Sein_textureImprove

`Sein_textureImprove`扩展可以支持`isImageCanRelease`和`anisotropic`的导出。

## Sein_imageBasedLighting

`Sein_imageBasedLighting`扩展可以让Unity中的全局反射被导出使用，主要是配合**Sein/PBR**中的`Env Reflection`，详情见[Sein标准材质](../scene-editor/material-sein)中的**全局反射**一节。

同时此扩展还支持全局漫反射的环境照明(在渐变或者Skybox的环境照明时)。

## Sein_atlas

`Sein_atlas`扩展可以让Unity中的图集被导出，详情见[图集](../scene-editor/atlas-sprite)一节。

## Sein_sprite

`Sein_sprite`扩展可以让Unity中的精灵被导出，详情见[图集](../scene-editor/atlas-sprite)一节。

## Sein_cubeTexture

`Sein_cubeTexture`扩展可以让Unity中的立方体纹理被导出。

## Sein_skybox

`Sein_skybox`扩展可以让Unity中的天空盒被导出，详情见[天空盒](../../tutorial/artist/skybox)一节。

## Sein_audio

`Sein_audio`扩展可以让Unity中的音频被导出，详情见[扩展-空间音频系统](../../extension/web-extensions/audio)一节。
