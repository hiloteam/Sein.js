# 引擎、游戏、世界和关卡

引擎`Engine`、游戏`Game`、世界`World`和关卡`Level`是Sein中的四个大容器，它们承担着不同的职责。

## 引擎

引擎类`Engine`是Sein的顶层容器，在大多引擎中，“引擎”一般是作为“游戏”的从属概念，或者平级概念，而在Sein中，则将其作为了游戏的上级。这么做的理由很简单，仅仅是一种设计而已。试想一下，如果你需要在一个页面上放多个Canvas（窗口），每个Canvas都是一个游戏，那么你是创建多个游戏+引擎，还是一个引擎管理着多个游戏，同步时序合理呢？Sein选择了后者，当然这也仅仅是个选择而已，于个人而言，觉得这种选择更加清晰简单。  

一般而言，`Engine`在你的整个游戏代码只会出现寥寥几句：  

```ts 
// 创建
const engine = new Sein.Engine({fps: 60});

// 添加游戏
engine.add(game);

// 如果有多个游戏，并想一次性销毁它们
engine.destroy();
```

在几乎所有的情况下，这几个方法就足够了，引擎也提供了像是`start`、`pause`、`resume`等等方法来进行更多控制，这些方法同样也是会应用于所有游戏的。在实际开发中，开发者极少会直接使用这些方法，而是使用`Game`的同名方法啦精确控制每一个游戏单独的状态。

## 游戏

`Game`是一个传统意义上的“游戏”的容器，它承载着一个游戏实际上的逻辑功能。通过全局的`game`实例（一般通过类似`actor.getGame()`的方法获得），我们可以使用Sein顶层提供的丰富功能。举个例子，对于单游戏的游戏，我们一般用下面几个方法控制整个游戏的周期：

```ts
game.start();

document.addEventListener('appPause', () => game.pause());
document.addEventListener('appResume', () => game.resume());
document.addEventListener('pause', () => game.pause());
document.addEventListener('resume', () => game.resume());
```

在这段代码中，我启动了游戏，并监听了浏览器的休眠和唤醒事件，来控制游戏的暂停和唤醒。  

`game`实例还提供了`restart`和`destroy`方法来帮助重启或销毁游戏。对应于这些方法，一系列类似`onStart`、`onDestroy`生命周期也会随之调用，不过我们一般不会直接直接使用它们，当然在一些特殊的状况你也可以使用。  

除了作为全局状态的控制者，`Game`也承担着游戏全局设置的实现。在初始化时，你需要传入一个类型为[IGameOptions](../../document/interfaces/igameoptions)的`options`参数，里面有针对游戏画布本身和一些画面特性的设置，之后你也可以通过`setOption`和`getOption`来修改和获取它们。

在这之外，从属于整个游戏Scope的全局变量，也会被保存在`game`实例下，它们各自有不同的功能。比如全局状态`gameState`（需要在初始化时传入指定的`StateClass`），资源管理器`resource`，全局事件管理器`event`（拥有一些默认事件，请见[IGlobalDefaultEvents](../../document/interfaces/iglobaldefaultevents)，你也可以自己扩展此接口），全局HID设备管理器`hid`（拥有一些默认事件，请见[IGlobalHIDDefaultEvents](../../document/interfaces/iglobalhiddefaultevents)，你也可以自己扩展此接口）。

>关于状态、资源、事件和HID的详细论述，请见后续章节。

`game`也提供了一些其他的方法或属性来方便开发，比如`bound`可以获取当前画布的尺寸信息，`env`和`devMode`则存储这当前的环境是开发还是发布，`ticker`和`fps`则是`Engine`同名属性的代理，它们能让开发者完全不理会`Engine`而仅仅关注当前`Game`的实例。

前面的章节说过，`Actor`本质上有两种——可以放入世界的以及不可以放入的。对于不可以放入世界的这类纯信息类的Actor，我们就将其放入`Game`中，它们的生命周期没有任何区别，有区别的仅仅是功能，比如`StateActor`。我们在`game`中完成对这类Actor的添加`addActor`、删除`removeActor`以及更新，有关Actor的内容请见后续章节。  

最后，也是`Game`的核心的功能，就是管理世界和关卡。`game`实例存储着所有世界和关卡的**元信息**，也就是它们的名字和类，其表面上就是下面几句代码：  

```ts
game.addWorld('main', MainGameMode, PreloadLevelScript);
game.addLevel('main', 'home', MainLevelScript);
game.addLevel('main', 'friend', MainLevelScript);

game.start();

setTimeout(() => game.switchLevel('home'), 1000);
```

这段逻辑中，我们首先为游戏添加了一个名为`main`的游戏并指定了其默认关卡`persistent`，后续又为`main`世界添加了`home`和`friend`两个关卡，之后启动了游戏并设置定时器在1000ms后执行关卡的切换。这就是Sein的整个游戏世界的组织方式，如果有多个世界，你也可以利用`switchWorld`来切换它们。  

注意这里添加世界和关卡都并没有立即创建它们，也没有直接指定`World`或者`Level`的子类。这个原因前面也提到过，Sein实际上使用**脚本**来描述世界和关卡的逻辑的，开发者并不直接控制它们。

## 世界

世界`World`是概念上承载3D场景的容器。类比一下，超级玛丽的水下关卡，就可以看做是一个世界。在一个世界中，一般拥有一个通用的玩法逻辑，而这个逻辑就由`GameModeActor`来具体体现（玩法相关内容会在后续章节具体叙述）。一般而言，我们需要对世界进行的操作都会被具体指定到`GameModeActor`中，但其还有另一些方法也很关键：

1. world.enablePhysic: 此方法用于启动物理引擎，关于物理引擎的内容将在后面论述。
2. world.setMainCamera: 设置主摄相机，引擎会默认第一个添加到场景的摄相机为主相机，关于摄相机的内容将在后面论述。
3. world.addActor/removeActor: 向世界中添加或移除`SceneActor`，将会被代理到关卡`Level`中的同名方法，但建议使用这里的方法，更符合概念上的逻辑。

`World`还承载着关卡切换的实际逻辑，以及世界级别的状态`world.state`的实际存储。除此之外，`world`还提供了一些访问器来获取一些通用对象，方便游戏开发体验，比如世界的几个单位向量：`upVector`、`downVector`、`rightVector`、`leftVector`、`forwardVector`、`backVector`。

## 关卡

关卡，作为顶层容器的最后一层，是实际上承载当前3D场景的容器，其逻辑由`LevelScriptActor`提供。所有的`SceneActor`也实际上存储在其中。那么我们如何来理解“世界”和“关卡”的区别呢？其实很简单。  

让我们在回顾一下上面说的那个超级玛丽的水下关卡。我们可以将整个水下关卡看做一个世界，这个世界拥有相同的玩法逻辑，比如“游动”、“吃金币”、“杀敌”等等。而在实际游玩前进过程中，我们可以觉察到这个世界是有分隔的，具体体现在每一个场景阶段的阻挡和整体迁移。也就是说，一个世界又可以被拆分为一个个小的关卡，而每个关卡独特的地方基本只有场景中各个物体的布局，这可以被称为“展示逻辑”。  

也就是说，世界的逻辑脚本`GameModeActor`是实际上的“玩法逻辑”，承载着该世界下所有关卡通用的“玩法”，比如“碰到金币就会吃掉它”、“踩到怪物就触发消灭或者死亡的判定”等等，而关卡的逻辑脚本`LevelScriptActor`则是承载着“展示”的作用，比如“什么时候会在哪里出现怪物”、“顶了砖头后出现的是什么”。  

当然这只是一个最通用和建议的说法，如果游戏本身类型比较特殊，比如一些单纯展示性的场合，你当然也可以选择把玩法逻辑写在关卡脚本。  

关卡类`Level`本身对外暴露的方法很少，只有`level.addActor`和`level.removeActor`，并且这两个方法一般建议通过`world`中的同名方法代理。但无论如何，`SceneActor`是实际存储于关卡中的，这也方便对Actor的批量创建和销毁等管理，可以较好得平台开销和聚合逻辑。关卡中同样也存储着自身级别的状态`level.state`，可用于存储一些视图相关的状态。  

除此之外，`level`最核心的功能还是进行关卡一系列的创建、继承、资源加载等流程，为整个游戏逻辑提供最基础的保障。
