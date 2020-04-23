# 事件

上面已经提到了“刚体事件”，在Sein中，所有的物理事件都是绑定在刚体组件`RigidBodyComponent`上的，在为Actor添加了刚体和碰撞体后，你可以使用下面的方式监听它与别的Actor的碰撞：  

```ts
actor.rigidBody.event.add('Collision', {selfActor, otherActor} => console.log('Collision', otherActor));
```

这段代码为actor的刚体添加了碰撞事件`Collision`的监听器，此事件会在此刚体和其他刚体碰撞时触发。

## 高级碰撞事件

`Collision`事件是最常见的事件，理论上足够应对大多数的Web游戏场合，但还有一些场合需要更多功能。比如要设计一个火焰陷阱，人物踩上去会收到持续伤害，离开后恢复正常。这就需要我们有一个方法，来判断人物是“在火堆内”还是“在火堆外”。  

其实不仅仅是火堆，奶妈的范围治疗、法师的范围伤害等等，理论上任何一个有“范围”概念的存在都可以抽象出“在内”和“在外”两种情况，这个和UE4中的“体积”很像。回到碰撞体中，如果要区分这两周状况，光靠单次的碰撞事件肯定不够，至少也要有“进入”和“离开”这两个事件。  

刚体组件提供了这样的事件，他们分别是`BodyEnter`和`BodyLeave`，同时还有`ColliderEnter`和`ColliderLeave`来提供精确到碰撞体的事件。不过处于性能考虑，要使用这些高级碰撞事件，开发者必须要在初始化物理世界的时候，显式开启开关：  

```ts
world.enablePhysic(
  new Sein.CannonPhysicWorld(CANNON, new Sein.Vector3(0, -9.81, 0)),
  true
);
```

或是在初始化之后显式调用方法：  

```ts
actor.getPhysicWorld().initContactEvents();
```

这里有个实例可以帮助你理解各个事件的顺序[碰撞事件](../../example/physic/collision-events)。
