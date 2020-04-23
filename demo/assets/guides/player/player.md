# 玩家

在一个游戏中，`actor`的受控来源一般分为两种——玩家和AI。比如还是拿超级马里奥距离，马大叔一般由玩家通过手柄控制，而蘑菇怪、库巴等则通过电脑（AI）自动控制。这就需要我们来区分玩家和AI，并且给予玩家比“世界”更高层次的能力，还需要给予AI能力，让其能够随时监控玩家的状态来进行操作。

## Player

“玩家”需要一个更高层次的抽象，这个抽象在Sein中就是[Player](../../document/classes/player)类，而存储其实例的单例也并非是`world`，而是`game`，这就给了其一个更高的层次来纵览全局。再者，我们在一场游戏中的玩家很可能不止一个，所以存储玩家的是一个`SMap`类型的实例`game._players`，其以玩家的名字（或者ID）为键，以`Player`实例为值。  

`Player`类本身定义的方法很少，最重要的是`switchController`和`releaseController`方法，用于获取一个控制器的所有权或者释放所有权。还提供了`getController`方法用于获取当期拥有所有权的控制器，以及`getState`方法用于获取当前为控制器所拥有的状态实例：  

```ts
const player = game.getPlayer();
player.releaseController();
player.switchController(heroController);
const heroController = player.getController<HeroController>();
const heroState = player.getState<HeroState>();
```

以上这段代码简单得描述了`player`的使用，那么如何创建和移除一个`player`呢？也很简单：  

```ts
game.clearPlayers();
game.createPlayer('myPlayer', MyPlayer, true);
game.createPlayer('myPlayer2', MyPlayer);
// result: myPlayer1
game.getPlayer<MyPlayer>();
// result: myPlayer2
game.getPlayer<MyPlayer>('myPlayer2');
game.removePlayer('myPlayer2');
```

这段代码展示了如何清空玩家、创建玩家以及移除玩家。这里注意到创建玩家时第二个参数，其指定了一个派生自`Player`的类，由于原来的玩家类功能很少很基础，所以在很多情况下都可能需要开发者去自定义自己的玩家类；第三个参数是`isDefault`，表明此`player`是否是默认的，对于`getPlayer`方法，如果不传参数，则会取得默认的`player`实例。

## 自定义Player

上面提到了自定义Player类，那么如何进行自定义呢？其实很简单，Player类还提供了三个基本生命周期——在初始化时触发的`onInit`、在获取控制器所有权时触发的`onSwitchController`以及释放控制器时的`onReleaseController`、还有更新时的`onUpdate`以及销毁时的`onDestroy`。加上自己编写的逻辑以便可以方便地进行自定义了，详细可见下面的实例。

## onCreatePlayers/onDestroyPlayers

你可以在任何地方创建和销毁玩家，但Sein中提供了两个建议的地方，这就是`GameModeActor`中的两个生命周期`onCreatePlayers`和`onDestroyPlayers`。  

`onCreatePlayers`会在`onLogin`之后触发，用于集中创建玩家对象，其有默认行为——创建一个命名为`player`的默认玩家实例；而 `onDestroyPlayers`则在`world`销毁前触发，用于集中销毁对象，其没有默认行为，需要开发者自行处理。

## PlayerControllerActor

“玩家”拥有的控制器由于可能和`player`实例绑定，所以比起通用的`ControllerActor`，其多出了几个方法，主要是用于快速和玩家实例绑定的`setPlayer`方法（实际上被代理到`player.switchController`），还提供了一个访问器`player`用于获取当前拥有其的玩家实例。在销毁时，其还会自动和玩家解除绑定。

## 应用和实例

比如在`player`中集中管理用户输入，再通过具体的接口方法下发到控制器中。输入的来源可以是具体的键盘、鼠标、手柄，也可以是网络输入，如此便可以打通联机的链路。

一个简单的实例可见[自定义玩家](../../example/player/player)。