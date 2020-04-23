## 碰撞体

物理计算中的第一大部分就是刚体的物理计算，第二部分则是为了触发这些计算，前置的“碰撞检测”。说到碰撞，就不得不提“碰撞体”。  

碰撞体本质上是计算机算力对真实世界的一种妥协，也可以认为是一种权衡。为什么这么说呢？你想，如果算力足够，哪还需要什么碰撞体，模型的点面数据就已经足够了。正因为算力不够，计算机不足以实时处理这么多面的求交计算，所以需要一种简化的方案，用一些基本几何体比如立方体、来近似模型在物理世界中的样子。  

举个例子，下面这张图中医院的模型，其外层那些绿色的线框围成的就是它的碰撞体。我们用一个立方体（六个非常规则的面）替代了模型本身进行物理世界中的计算，在大幅提升运算效率的同时也能取得不错的表现效果：  

![collider](/assets/guides/assets/physic/1.jpg)  

在Sein中，碰撞体由[ColliderComponent](../../document/classes/collidercomponent)的派生类描述，你可以直接添加对应的组件来为Actor添加一个碰撞体，比如盒碰撞体：  

```ts
actor.addComponent('boxCollider', Sein.BoxColliderComponent, {
  size: [1, 1, 1]
});
```

这段代码中，`actor`被添加了一个长宽高均为1的盒碰撞体。在初始化时，你也可以通过传入`offset`和`quaternion`来修改碰撞体相对于刚体质心的位移和旋转。  

目前，Sein提供了盒碰撞体[BoxColliderComponent](../../document/classes/boxcollidercomponent)、球碰撞体[SphereColliderComponent](../../document/classes/spherecollidercomponent)、平面碰撞体[PlaneColliderComponent](../../document/classes/planecollidercomponent)（建议用盒碰撞体覆盖使用）、圆柱碰撞体[CylinderColliderComponent](../../document/classes/cylindercollidercomponent)。胶囊碰撞体目前尚未支持，你可以尝试自己拼接。

>注意，碰撞体组件的添加必须要在刚体组件之后，在开发环境下，Sein会检查并抛出异常。

## 触发器

在游戏中，我们并非将所有碰撞体完全用于物理计算，也有仅仅被作为像是“任务点”这样的功能性场景。在这种场景下，碰撞体只会单纯触发事件，却不会反馈给刚体任何的物理效应，这类碰撞体就被称为“触发器”。  

举个例子。比如我们做一个FPS，角色一开始在一个房间内，当角色走到一个门前时门会自动打开，这时候就可以在门前放一个纯`SceneActor`，并在下面挂一个刚体组件和一个盒碰撞体组件，这样我们只要监听刚体的碰撞事件便可以执行开门逻辑了。  

要将碰撞体组件设为触发器，只要在初始化参数中传入`isTrigger: true`即可。

## Debug

在使用物理系统时我们很容易出现疏忽，却又苦于没有调试的方法。为了解决这个问题，Sein提供了一个Debug工具类，它可以帮助我们对碰撞体进行可视化，从而大幅降低调试成本。工具类以扩展的形式存在，先安装扩展  

```sh
npm i seinjs-debug-tools
```

之后引入执行：  

```ts
import 'seinjs-debug-tools';

class MainGameMode extends Sein.GameModeActor {
  private physicDebugger: Sein.DebugTools.CannonDebugRenderer;

  public onAdd() {
    this.physicDebugger = new Sein.DebugTools.CannonDebugRenderer(this.getGame());
  }

  public onUpdate() {
    this.physicDebugger.update();
  }
}
```
