# 基本几何体

基本几何体是一类特殊的模型，这类模型可以由简单的数学量来描述，比如“长宽高”、“半径”等等，简而言之，是“规则”的。这类模型常常被用于做实际模型交付前的逻辑占位，用于让开发和美术的工作达到并行，也可以用作一些特殊风格游戏的基础元素。  

## 默认集成

Sein中提供了一些默认的基础几何体，你也可以通过实现`Geometry`并封装来实现自己的基本几何体，下面先介绍几种默认集成的几何体：  

### 立方体-BSPBox

理论上所有的基础几何体都应该提供一个Component和一个作为包装容器的Actor，以便于开发者在不同的状况下做出不同的选择。  

立方体提供了`BSPBoxComponent`和`BSPBoxActor`作为组件和容器，其通过接口参数[IBSPBoxComponentState](../../document/interfaces/ibspboxcomponentstate)来初始化一个立方体组件或者顶层Actor。具体的实例可见例子[立方体](../../example/bsp/box)。

### 球-BSPSphere

立方体提供了`BSPSphereComponent`和`BSPSphereActor`作为组件和容器，其通过接口参数[IBSPSphereComponentState](../../document/interfaces/ibspspherecomponentstate)来初始化一个立方体组件或者顶层Actor。具体的实例可见例子[球体](../../example/bsp/sphere)。

### 圆柱-BSPCylinder

立方体提供了`BSPCylinderComponent`和`BSPCylinderActor`作为组件和容器，其通过接口参数[IBSPCylinderComponentState](../../document/interfaces/ibspcylindercomponentstate)来初始化一个立方体组件或者顶层Actor。具体的实例可见例子[圆柱](../../example/bsp/cylinder)。

### 平面-BSPPlane

立方体提供了`BSPPlaneComponent`和`BSPPlaneActor`作为组件和容器，其通过接口参数[IBSPPlaneComponentState](../../document/interfaces/ibspplanecomponentstate)来初始化一个立方体组件或者顶层Actor。具体的实例可见例子[平面](../../example/bsp/plane)。

### 变形-BSPMorph

变形体提供了`BSPMorphComponent`和`BSPMorphActor`作为组件和容器，其通过接口参数[IBSPMorphComponentState](../../document/interfaces/ibspmorphcomponentstate)来初始化一个变形体组件或者顶层Actor。具体的实例可见例子[变形体](../../example/bsp/morph)。

其一般用来实现变形体动画，这个相对复杂一些，并且一般是通过glTF文件实现的。

## 自定义

利用基本几何体，你可以做出很多自定义的工作，也可以自己实现`Geometry`来自定义一个特殊的几何体。

### 组合

由于每个基本几何体都提供了Component，那么我们自然就可以自己创建一个Actor，作为容器来将它们组合起来一起使用。比如例子[场景组件组合](../../example/core/scene-component-compose)中，就利用球体、立方体和圆柱，组合成了一个小人，之后只需要修改`actor.transform`就可以修改小人整体的位置了，也可以为其注册一些动画来快速使用。

### 自定义几何体

Sein同样允许你自定义基本几何体Component，这一般分为几部完成：  

1. 继承[Geometry](../../document/classes/geometry)实现自定义的几何数据。
2. 定义初始化参数类型接口，需要继承自[IBSPComponentState](../../document/interfaces/ibspcomponentstate)。
3. 继承[BSPComponent](../../document/classes/bspcomponent)来派生自己的组件类，并重写`protected convertState`方法，在这个方法中，你需要过滤自己的初始化参数，删除自己派生接口中的其他参数并创建新的`geometry`赋予初始化参数，比如：  

```ts
@SClass({className: 'BSPPlaneComponent'})
export default class BSPPlaneComponent extends BSPComponent<IBSPPlaneComponentState> {
  public isBSPPlaneComponent: boolean = true;

  protected convertState(
    initState: IBSPPlaneComponentState 
  ): IStaticMeshComponentState {
    const {width, height, widthSegments, heightSegments, ...others} = initState;

    const result = others as IStaticMeshComponentState;
    result.geometry = new PlaneGeometry(initState);

    return result;
  }
}
```

由于`Geometry`比较依赖于渲染引擎，Sein目前不建议自己去随意自定义，有问题可以咨询作者。
