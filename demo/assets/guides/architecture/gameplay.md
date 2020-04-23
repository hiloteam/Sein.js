# 玩法逻辑

从前面的内容我们了解到，在Sein中，“业务逻辑”和“功能逻辑”被区分的十分清晰，有一个明确的界限。“功能逻辑”，基本是编写在各个Component或者一部分Actor中的，而“业务逻辑”，则编写在两种特殊的Actor——`GameModeActor`和`LevelScriptActor`中。

## GameModeActor

`GameModeActor`在逻辑关系上是挂载在`World`下面的，因为其体现出了一个世界下所有关卡共有的玩法逻辑，还是拿超级马里奥这种平台跳跃游戏举例，假如我们设计这么一个规则：  

1. 金币在所有世界是共享的，`game.state`中提供了`coins`来查询金币、`addCoin`和`reduceCoin`来操作金币
2. 每个世界马里奥的生命的都是独立的（三条），当生命归零时先扣除十个金币，金币不足以扣除时游戏结束
3. 马里奥碰到敌人时在控制器中自行判定死亡还是消灭，消灭得一个金币
4. 马里奥碰到金币时得一个金币

下面我们就基于这个规则，来编写一个示例的GameMode：

```ts
class MainWorldState extends Sein.StateActor {
  private _life: number = 3;

  get life() {
    return this._life;
  }

  get isDead() {
    return this._life === 0;
  }

  public kill() {
    this._life - 1;
  }

  public revive() {
    this._life = 3;
  }
}

class MainGameMode extends Sein.GameModeActor<MainWorldState> {
  // 指定状态类，可以通过`this.state`获取
  public static WorldStateClass = MainWorldState;

  // 最先被调用，这里可以放一些、也是唯一可以放阻塞性质的异步逻辑的生命周期，将会阻塞后续的周期
  public async onLogin() {

  }

  // 由于GameMode也是Actor，所有自然也有这个生命周期，不过不常用
  public onInit() {

  }

  // 由于GameMode也是Actor，所有自然也有这个生命周期，一般用于实际的初始化
  // 可以在这里初始化物理引擎和其他东西
  // 现在我们在这里初始化事件
  public onAdd() {    
    this.getGame().event.add('HeroCollide', handleHeroCollide);
  }

  private handleHeroCollide = (type: 'Killed' | 'AddCoin') => {
    const game = this.getGame<GameState>();

    if (type === 'Killed') {
      this.state.kill();
    } else {
      game.state.addCoin(1);
    }

    if (this.state.isDead()) {
      game.state.reduceCoin(10);

      if (game.state.coinEmpty) {
        this.state.revive();
        // 将马里奥返回上一个存档点位置的逻辑
      }
    }
  }

  // 创建玩家，这个和玩家系统相关，这里先不论述
  // 即使不利用玩家系统，你也可以完成很多游戏的逻辑
  public onCreatePlayers() {
    super.onCreatePlayers();
  }

  // 由于GameMode也是Actor，所有自然也有这个生命周期，用于处理每一帧更新的逻辑
  public onUpdate() {    

  }

  // 销毁事件
  public onDestroy() {
    this.getGame().event.remove('HeroCollide', handleHeroCollide);
  }

  // 销毁玩家，这个和玩家系统相关，这里先不论述
  public onDestroyPlayers() {

  }
}
```

当然，对于命条数这种状态的处理，我们还有更好的方法，但这涉及到玩家系统，我们将在那一章进行探讨。  

可见，GameModeActor在基础的InfoActor之上，还添加了一些新的生命周期，其中最特别的就是`onLogin`了，这个周期允许你做出阻塞性质的业务逻辑，也是整个基础游戏框架中唯二的可以阻塞其他生命周期的异步周期，之所以加上它是考虑到Sein是一个Web游戏引擎，很多情况下我们需要在世界初始化之前去通过HTTP或RPC请求一些远端数据，并且后续的渲染、资源等可能依赖与这些数据。除了`onLogin`之外，还有`onCreatePlayers`和`onDestroyPlayers`这一对周期，它们用于创建和销毁玩家，这个也和玩家系统有关，在后续章节论述。

最后有一点要说明，GameModeActor中存放的，一定是玩法逻辑。这也就是说不太建议你在其中去执行类似场景布置、Actor生成和操作这样的逻辑，尤其是在`onAdd`这种生命周期内，因为此时关卡尚未真正的加载，实际上的SceneActor的容器还不存在。但如果真的有强烈的要求，比如添加通用特效等等在游戏过程中实时处理的逻辑，也可以酌情加入。

## LevelScriptActor

通过`GameModeActor`，我们描述了游戏的基本玩法，但还需要在关卡内对场景进行实际的布置，而具体关卡的布置，则是通过`LevelScriptActor`来完成的。下面接着上面的这个例子的设计，进行其中一关的编写：  

```ts
class MainLevelScript extends Sein.LevelScriptActor {
  // 最先被调用，这里可以放一些、也是唯一可以放阻塞性质的异步逻辑的生命周期，将会阻塞后续的周期
  public async onLogin() {

  }

  // 在这里进行资源的预加载，也可以创建用于预加载的Actor，不过需要保证这些Actor依赖的资源已被加载
  public onPreload() {
    const {resource} = this.getGame();

    resource.load({type: 'GlTF', name: 'hero.gltf', url: '/assets/hero.gltf'});
    resource.load({type: 'GlTF', name: 'enemy.gltf', url: '/assets/enemy.gltf'});
    resource.load({type: 'GlTF', name: 'coin.gltf', url: '/assets/coin.gltf'});
  }

  // 在这里监听资源加载进度，可以进行预加载展示的Actor的更新
  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  // 资源加载完毕，正式创建关卡
  public onCreate() {
    const game = this.getGame();
    const {resource} = game;

    const hero = resource.instantiate('hero.gltf', {name: 'hero'});
    resource.instantiate('enemy.gltf', {name: 'enemy1'}).get(0).setPosition(5, 0, 0).tag = new SName('enemy');
    resource.instantiate('enemy.gltf', {name: 'enemy2'}).get(0).setPosition(10, 0, 0).tag = new SName('enemy');
    resource.instantiate('enemy.gltf', {name: 'enemy3'}).get(0).setPosition(15, 0, 0).tag = new SName('enemy');
    resource.instantiate('coin.gltf', {name: 'coin1'}).get(0).setPosition(3, 4, 0).tag = new SName('coin');
    resource.instantiate('coin.gltf', {name: 'coin2'}).get(0).setPosition(7, 3, 0).tag = new SName('coin');
    resource.instantiate('coin.gltf', {name: 'coin3'}).get(0).setPosition(11, 4, 0).tag = new SName('coin');
    
    hero.rigidBody.event.add('Collide', ({otherActor}) => {
      if (otherActor.tag.equalsTo('enemy')) {
        game.event.trigger('HeroCollide', 'Killed');
      } else if (otherActor.tag.equalsTo('coin')) {
        game.event.trigger('HeroCollide', 'AddCoin');
      }
    });
  }

  // 销毁关卡，你可以在这里设置需要继承到下一个关卡的Actor的`persistent`属性
  // 这个也可以在`onCreate`中完成
  public onDestroy() {

  }
}
```

>注意这里没有为关卡指定状态类，如果有需求，你可以通过`public static LevelStateClass`来指定，即使不指定，也会有一个基于`StateActor`的默认状态生成。  

上面我们自定义了一个关卡的逻辑脚本`MainLevelScript`，其也在基础的Actor之上添加了一些新的生命周期，其中`onLogin`与GameModeActor一致，`onPreload`和`onLoading`则用于资源预加载，在资源加载完毕后则会进入`onCreate`周期，在这里面可以添加关卡实际的创建逻辑。  

>注意加载单个资源失败并不会阻塞脚本流程，如果有这个需求，可以在`onLoading`的参数`state`中查看有没有`error`，如果有则出现了异常，可以用flag进行判断。

在这个自定义的脚本里，假设已经有了资源，且已经拥有了控制`Hero`的控制器。我们直接加载了资源、创建了一些敌人（这里忽略摄像机和灯光的创建），并监听了在`Hero`的碰撞时控制器派发的事件，再通过全局事件广播，进而完成了整个场景的布置。  

>当然，关卡的布置理论上应该在编辑器内完成，这里前面也提到过，Sein是使用Unity做编辑器、gltf来做序列化资源索引的，这个在后面会说到。

## 逻辑分割

由于`GameModeActor`和`LevelScriptActor`也是`Actor`，所以其自然也可以挂载`Component`，这个的主要作用在于逻辑分隔。考虑到有时候我们的逻辑会比较复杂，将所有逻辑写在一个脚本文件中是丑陋且不合理的，并且有时候我们也会要求一些比较独立的玩法逻辑可以拆出来复用，这时候可挂载Component的这个特性就有了很大的用处。我们可以将一些特定的逻辑聚合到一个Component中，在将其注册给特定的GameModeActor或LevelScriptActor，便可实现这一点。

## 世界和关卡调度的细节

在大多情况下，开发者无需理会世界和关卡切换时的细节，但在一些状况时我们还是希望明确切换时到底发生了什么，以便于进行更加细致的调控和优化，下面我就描述一下Sein中调度的细节：  

### 世界

世界的调度相对比较简单，从一个世界切换到另一个世界的行为是游戏实例`game`实现的。在切换时，`game`实例将会先检查当前是否已有`world`实例，若有则执行`world.destroy`方法，来根据传入的`needInheritActors`参数决定是否要从上一个世界继承标记为`persistent`的Actor。之后通过新`World`的`GameModeActor`生成一个新的`world`实例，再直接取得该`world`的默认入口关卡`persistent`，最终执行切换到入口关卡的逻辑，并根据前面的参数，给关卡传入需要继承的Actors的列表。

### 关卡

相对于世界的调度，关卡由于涉及到资源预加载、实际的Actor管理以及伴随的复杂视图逻辑、还有默认开启的Actor继承，其调度就相对复杂了一些。  

关卡的切换是其父级`world`实例实现的。在切换时，首先保存老关卡的引用`oldLevel`，之后根据新关卡的类生成一个新的关卡`level`，之后执行`oldLevel.destroy`进行老关卡的销毁并得到要继承的、标记为`persistent`的Actor，然后新关卡立即对这些Actor进行继承，在之后就是新关卡的初始化了。  

在初始过程中，`level`在其中会先调用`onLogin`，之后是`onPreload`，之后便等待加载结束后执行`onCreate`，进行关卡真正的创建。  

>注意！关卡的`onUpdate`生命周期将会在`onLogin`完成后便立即开始执行！这样是为了便于做加载动画。若要区分加载时和创建完毕时的状态，请自行设置在`onCreate`末尾会变更的flag！

## 渐进式

到了玩法逻辑这一张的尾声，我们需要回忆一下第一章时给Sein下的一个定义：  

>**SEIN.JS**（下面称为”Sein”）是一个运行在Web端的渐进式3D游戏引擎。  

这里面提到了“渐进式”这个词，而这个词对于Web前端开发的大家想必不怎么陌生。所谓“渐进式”，就是指你可以有多种的开发范式，这些范式中有入门级别的简单易上手（适合小工程），也有相对严谨但也定制化较少（中型工程），还有定制化很强、用到大量引擎特性并且有高可维护性的（大工程）。  

我们说“渐进式”其实是合理的，你不能要求一个小工程搞那一套复杂的设计模式，也不能不要求大工程拥有良好的设计。最理想的情况就是在保证一定约束的情况下，给新手以及小工程提供一个比较简单的开发模式，让其快速出活，而对于老手或者重大工程，则基于更大的灵活性，让其可以做出维护性强的代码——Sein的定位即为如此。

在Sein中，你可以只用一个单纯的`LevelScriptActor`以及纯JS或一堆`any`的TS来开发小游戏项目，所有的逻辑都写在关卡脚本里并不去自定义任何的`Actor`，仅用内置的Actor、去改改它们的`transform`、加之碰撞检测等快速完成将开发；你也可以自定义`Actor`和`Component`，尝试一些初步的解耦，来进一步规范你的逻辑；更上一层，你可能需要多个关卡乃至多个世界的协作，并且可能会抽出关卡间的复用逻辑，这时候你就需要充分利用“玩法逻辑分隔”、“事件机制”等等；在向上，你的玩家逻辑可能越来越复杂，需要更多的设计和解耦，这时候就可以引入“玩家系统”了。

至少在GamePlay这一层，你在Sein中可找到自己在各个阶段需要的开发模式。
