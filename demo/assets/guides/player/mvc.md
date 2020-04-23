# MVC体系

对于绝大部分小游戏，其逻辑运用[玩法逻辑](../architecture/gameplay)之中的知识就以足够，但如果项目更加复杂，尤其是涉及到玩家/AI对模型的控制这种，就必须要有更合理的方案来实现。

Sein的玩家系统主要由两部分构成，一部分是在“世界”这个层次处理的，一部分则是在“游戏”层次进行处理。

## 模型，状态和控制器

玩家系统在“世界”层次处理的，是模型、状态和控制器。其中模型可以认为是一个个`SceneActor`，状态则是前面提到过的`StateActor`的派生`PlayerStateActor`，而控制器，则是`ControllerActor`的两个派生`PlayerControllerActor`和`AIControllerActor`，分别用于处理玩家和AI的控制。这一套实际上和视图编程领域的**MVC**模型基本一致。

## PlayerStateActor

[PlayerStateActor](../../document/classes/playerstateactor)派生自`StateActor`，其在StateActor的基础上添加一个方法`getController`方法，用于快速获取和其关联到的ControllerActor。其他和StateActor的使用方法基本一致，完全由开发者自己定义。  

## ControllerActor

[ControllerActor](../../document/classes/controlleractor)本质上是一种特殊的`SceneActor`，顾名思义，“控制器”表示着其承载着对其他Actor的控制逻辑，所以其相对于标准的SceneActor多出了一些特定方法和生命周期。下面以一个控制器的使用为例，来看看它具体的作用：    

```ts
class HeroController extends Sein.PlayerControllerActor<HeroState> {
  public onAdd() {
    this.getGame().hid.add('KeyDown', this.handleKey);
    this.getGame().hid.add('KeyUp', this.handleKey);
  }

  public onPossesActor(actor: Sein.SceneActor) {
    actor.rigidBody.event.add('Collision', this.handleCollision);
  }

  public onDisPossesActor(actor: Sein.SceneActor) {
    actor.rigidBody.event.remove('Collision', this.handleCollision);
  }

  private handleCollision = ({otherActor}: Sein.ICollisionEvent) => {
    this.state.hit(otherActor.tag.equalsTo('strong'));

    this.getLevel<LevelState>().state.kill();
    otherActor.removeFromParent();
  }

  private handleKey = (event: Sein.IKeyboardEvent) => {
    if (event.type === 'keydown') {
      activeKeys[event.keyCode] = true;
    } else {
      activeKeys[event.keyCode] = false;
    }
  }

  public onUpdate() {
    if (!this.actor) {
      return;
    }

    // w
    if (activeKeys[87]) {
      this.actor.transform.translate(forwardVector, speed);
    }

    // s
    if (activeKeys[83]) {

    }

    // a
    if (activeKeys[65]) {
      this.actor.transform.translate(rightVector, -speed);
    }

    // d
    if (activeKeys[68]) {
      this.actor.transform.translate(rightVector, speed);
    }
  }
}

/* ------------------ LevelScriptActor.onCreate ------------------ */
const hero = game.resource.instantiate('hero.gltf', {name: 'hero'});
const heroState = game.addActor('heroState', HeroState);
const herController = world.addActor('heroController', HeroController, {
  actor: hero, state: heroState, followActor: true
});
```

这里我们假定模型资源`hero.gltf`已加载并且状态类`HeroState`已实现。先看最后几行在`LevelScriptActor.onCreate`里执行的代码。这里面我们先实例化了模型`hero`，之后添加了状态`heroState`，最后添加了控制器`herController`并在初始化参数中传入了方才创建的`actor`和`state`。这段代码将模型、状态、控制器三者关联了起来。对于这三者而言，他们的逻辑关系也很明确——控制器控制模型，并将属性等交由状态管理。在游戏过程中，控制器可以切换控制的模型、也可以切换当前的状态，而状态也可以用于描述不同的模型，同时模型也可以由不同的控制器控制。这样一来三者的关系就完全解耦，灵活性非常强。  

再让我们看看上面`HeroController`的实现，其继承自`PlayerControllerActor`，这是一种特殊的玩家专用的`ControllerActor`，下面会提到，这里我们先专注其控制器方面的功能。在`HeroController`中，我们重写了其生命周期`onAdd`、`onUpdate`、`onPossesActor`和`onDisPossesActor`，`onAdd`与`onUpdate`和标准Actor行为一致，无需赘述，而`onPossesActor`和`onDisPossesActor`则有着特殊的作用。其中`onPossesActor`将在控制器**获取一个actor的控制权**时调用，而`onDisPossesActor`将在**失去actor控制权**调用，从逻辑中可以看到`HeroController`的实例在获取`actor`控制权时将会给其添加碰撞事件监听器，而拾取控制时将会取消监听。  

一般而言，若初始化时传入了`actor`参数，则会自动触发一次`onPossesActor`周期，否则需要手动执行`controller.possessActor`和`controller.dispossessActor`方法进行对`actor`的控制和取消控制。对于状态也一样，可以通过初始化参数`state`在控制器生成时就指定，也可以后续用`switchState`方法来切换状态。而在获取方面，`actor`和`state`访问器以及`getActor`和`getState`方法都可以，后者提供了泛型能帮助更好的类型推断。  

这些多出来的方法中，和受控制的“模型”相关的有方法有三个`possessActor`个`dispossessActor`、相关访问器是`actor`（以及`getActor`）、相关生命周期是`onPossesActor`和`onDisPossesActor`；和“状态”相关的方法则是`switchState`、相关访问器是`state`（以及`getState`）；还有两个特殊方法用于控制对`actor`的跟随`followActor`和`unFollowActor`。

到这里你可能有个疑问——既然控制器看起来只有单纯的控制逻辑，那么其为什么为什么派生自`SceneActor`而不是`Actor`呢？这很简单，想象一些对战游戏的场景，可以想象“角色”是舞台上的人偶，而“控制器”则是玩家在舞台上操作人偶的手（玩家在世界中的代理），这个手显然也是要随着角色一起移动的。而在游戏实践中，我们也常常会将主摄像机组件添加给控制器，让控制器跟随玩家移动，而摄像机跟随控制器的根节点移动。  

这也就是为何ControllerActor还有初始化参数`followActor`和用于动态更改它的`followActor`和`unFollowActor`方法，它用于指定控制器是否在运行时跟随模型。在一些游戏中需要跟随，一些中则不要，根据需求取舍。

## 实例

你可以查看实例[玩家系统-基础](/example/player/basic)来感受一些这套MVC系统真正的运作。
