# 物理世界

在真实世界中，体现自然规则学科是物理。物理规则通过一套（相对而言）精密的理论体系来（逼近）描述这个现实世界，而游戏作为现实的一种映射，自然也需要有这么一套体系，这套体系在游戏世界中，被称为“物理系统”，而实现它的，则是“物理引擎”。

## PhysicWorld

在Sein中，物理系统和内核是分离的。逻辑系统中有游戏世界`World`，物理系统则也有物理世界`PhysicWorld`，只不过后者从属于前者。PhysicWorld本质上是一个接口[IPhysicWorld](../../document/interfaces/iphysicworld)，它只定义了一套接口，或者你可以理解为是一套适配器，理论上任何第三方的物理引擎只要实现了这个适配器接口，它就可以被接入Sein中。

>这里特别感谢BabylonJS带来的启发。

Sein中默认提供了当前环境下在功能、性能和尺寸中平衡得最好的引擎Cannon.js，不过由于原作者不在维护，所以我fork了一个版本修了些问题——[cannon-dtysky](https://github.com/dtysky/cannon.js)。

## CannonPhysicWorld

`CannonPhysicWorld`作为Cannon.js和Sein的物理系统间的适配器，实现了物理系统底层中的所有功能。实际开发中，一般讲物理世界的初始化放在`GameModeActor`中：  

```ts
import * as CANNON from 'cannon-dtysky';

class MainGameMode extends Sein.GameModeActor {
  public onAdd() {
    thi.getWorld().enablePhysic(new Sein.CannonPhysicWorld(
      CANNON,
      new Sein.Vector3(0, -9.81, 0)
    ));
  }
}
```

这段代码中，我们使用`world.enablePhysic`以及实现了`IPhysicWorld`的类来启用物理引擎，这里使用的是`CannonPhysicWorld`，其提供了两个参数来创建基于Cannon.js的物理世界：第一个参数是CANNON模块的引用，第二个参数则是一个用于指定**重力加速度**的向量，在这里取地球上的标准重力加速度。

我们在使用物理系统的功能之前，总是必须要启用一个物理世界才可以。