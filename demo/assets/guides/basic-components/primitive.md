# 图元组件

在`SceneComponent`的派生中，有一类特殊的Component被称为**图元组件**，它们拥有着普适地构造带有图元信息的实例的能力。

## PrimitiveComponent

`PrimitiveComponent`是所有图元组件的基类，其承载着图元信息的存储以及渲染属性的管理，它下面的两个派生类`StaticMeshComponent`和`SkeletalMeshComponent`即为实际上的静态和带有骨架的模型组件，理论上任何图元相关的派生类都应该继承自它。图元组件的`needUpdateAndDestroy`默认为`false`。

>当然，我们一般不会去继承`PrimitiveComponent`，而是继承它的两个内置子类。

## StaticMeshComponent

`StaticMeshComponent`是静态Mesh组件，其主要拥有`geometry`和`material`两个属性，同时还有`getGeometry`和`getMaterial`方法，这两个方法主要用于针对拥有多个primitive的组件，来通过图元名字获取对应的实例。

我们可以非常简单得构造一个StaticMeshComponent：  

```ts
world.addActor(Sein.StaticMeshComponent, {geometry, material});
```

当一般情况下，我们并不会这么使用它，在Sein标准工作流中，我们通常使用一种叫**逻辑绑定**的方法，将glTF文件中的指定节点和其绑定起来，这个这里先不用关心，后面会有详细的论述。

## StaticMeshActor

理论上任何一个根组件是`StaticMeshComponent`的`Actor`都可以被视为`StaticMeshActor`，其一般是为了方便我们使用而构造的，在很多情况下，我们会看到一个`StaticMeshActor`或者`SceneActor`下挂载着多个`StaticMeshComponent`，这个可以视为一种抽象。

通常来讲，我们在进行**逻辑绑定**的时候，`StaticMeshActor`比起`StaticMeshComponent`更为常见。

## SkeletalMeshComponent

`SkeletalMeshComponent`相比于`StaticMeshComponent`多出了一个**骨架**的概念，可以将其视为拥有绑定了骨架并且蒙皮后的Mesh。

直接创建一个SkeletalMeshComponent相对困难许多，一般我们也不会这样去做（这一般是美术的工作），我们通常是直接使用glTF文件中的数据。

>当然，如何抽象出一个骨架组件也在我们的计划中。

## SkeletalMeshActor

理论上任何一个根组件是`SkeletalMeshComponent`的`Actor`都可以被视为`StaticMeshActor`，其本质上和`StaticMeshActor`相对于根组件的关系没什么区别，我们逻辑绑定的时候一般也主要使用它。
