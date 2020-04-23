# 灯光

灯光同样是游戏世界的重要组成部分，目前的任何一个游戏若想达到较好的表现效果，都需要对灯光有着细致地琢磨。虽然在Web端（尤其是移动端的中低端设备）一般无法承载复杂的光照，但作为一个完整的引擎，Sein还是提供了几种常见的光源。  

灯光一般要配合特定材质使用，比如前面提到的两种支持光照的材质`BasicMaterial`和`PBRMaterial`。

## 常见光源

### 环境光

环境光是针对整个游戏世界的灯光，可以用它来为整个游戏世界设定一个全局的基础照明。其提供了组件[AmbientLightComponent](../../document/classes/ambientlightcomponent)和Actor[AmbientLightActor](../../document/classes/ambientlightactor)来让开发者灵活选择应用方式，环境光的可配置参数可见[IAmbientLightComponentState](../../document/interfaces/iambientlightcomponentstate)，具体使用例子可见[环境光](../../example/light/ambient-light)。

### 平行光

平行光是照向一个特定方向的光，可以类比为太阳光，其光照计算相对简单，也是移动设备为数不多的可用灯光之一。其提供了组件[DirectionalLightComponent](../../document/classes/directionallightcomponent)和Actor[DirectionalLightActor](../../document/classes/directionallightactor)来让开发者灵活选择应用方式，环境光的可配置参数可见[IDirectionalLightComponentState](../../document/interfaces/idirectionallightcomponentstate)，具体使用例子可见[平行光](../../example/light/directional-light)。

### 聚光灯

聚光灯是照向一个特定方向、特定范围、可衰减的光，可以类比为手电筒。其提供了组件[SpotLightComponent](../../document/classes/spotlightcomponent)和Actor[SpotLightActor](../../document/classes/spotlightactor)来让开发者灵活选择应用方式，环境光的可配置参数可见[ISpotLightComponentState](../../document/interfaces/ispotlightcomponentstate)，具体使用例子可见[聚光](../../example/light/spot-light)。

### 点光源

点光源是以一个球心，向球面外发射特定范围、可衰减的光，可以类比为像是夜明珠那样的光源。其提供了组件[PointLightComponent](../../document/classes/pointlightcomponent)和Actor[PointLightActor](../../document/classes/pointlightactor)来让开发者灵活选择应用方式，环境光的可配置参数可见[IPointLightComponentState](../../document/interfaces/ipointlightcomponentstate)，具体使用例子可见[聚光](../../example/light/point-light)。

## 实时阴影

Sein提供了简单的实时阴影的实现，你可以修改灯光Component的`shadow`属性来设置阴影，并通过设置模型材质的`castShadows`和`receiveShadows`来决定是否要进行阴影的发射和接收。可见粒子[实时阴影](../../example/light/shadow)。  

一般而言，实时阴影开销较高，不建议在移动端使用，或者建议做好降级措施。

## 建议

一般而言，我们不建议在移动端上直接使用实时光照，在经过测试的状况下，最多也只建议使用平行光和环境光，在大多数情况下，可以以**unlit(熄灭)模式**导出你的模型，或者自己编写特殊的无需光照的或其他优化过的材质，这样你的渲染效果就完全由贴图或者顶点颜色控制了。  

倘若不是在移动端，那么在条件允许的情况下，你可以尽情使用它们来达到你想要的效果，倘若引擎内置的材质无法满足，你也可以通过自定义材质加上灯光的`sematic`来完成效果，这个将在后续的自定义材质章节说到。

## 烘焙

到这你可能会问：有时候我们确实要在移动端想达到良好的光照效果，并且一定要有阴影，有没有办法？办法当然是有的。事实上，即便是桌面游戏或者移动端非Web平台游戏，也并非场景中的所有东西都是走的实时阴影。试想一下，对于完全静止的物体和完全静止的光源，我们去实时计算它的光照和阴影实际上是没有意义的，而在很多场合下，这种情况并不少见，比如家装领域、地牢场景等等。在这种情况下，我们可以将光照信息预先计算存储下来，比如存到一张纹理里，那么在实际渲染时光照的计算实际上就变成了对一张纹理的采样，这个是典型的用空间换时间，并且这个事件的收益很大。这种手段，我们一般称为**烘焙**，当然烘焙不仅仅特指灯光预先计算，动画等都可以烘焙。

烘焙目前已经完全支持，详见[烘焙](../scene-editor/baking)一章。
