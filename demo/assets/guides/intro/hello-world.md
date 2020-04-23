# Hello, world

>这一节的内容将会完全依赖于上一节[开发体系](./workflow)的内容，如果还有没实践过请务必先观看上一节！  

在这一节，我们将根据CLI生成的模板工程，先来一窥Sein的基本运作方式。

## 入口

首先从整个工程的入口出发，这里以React为视图引擎的版本为例，在`src/index.tsx`中，我们可以看到一个顶层的React组件`Game`：  

```tsx
import {main} from './game';

class Game extends React.PureComponent {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private game: Sein.Game;

  public componentDidMount() {
    this.game = main(this.canvas.current);
  }

  public componentWillUnmount() {
    this.game.destroy();
  }

  public render() {
    return (
      <canvas
        className={'game'}
        ref={this.canvas}
      />
    );
  }
}
```

在这个文件中，我们引入了`./game/index.ts`中的`main`函数，并在组件中渲染了一个Canvas，并将其引用传给了作为实际游戏部分入口的`main`函数，下面让我们看看`main`中的内容：  

```tsx
import * as Sein from 'seinjs';

import GameState from './states/GameState';
import MainGameMode from './scripts/MainGameMode';
import MainLevelScript from './scripts/MainLevelScript';

export function main(canvas: HTMLCanvasElement): Sein.Game {
  const engine = new Sein.Engine();

  const game = new Sein.Game(
    'intro-game',
    {
      canvas,
      clearColor: new Sein.Color(0, .6, .9, 1),
      width: canvas.offsetWidth,
      height: canvas.offsetHeight
    },
    GameState
  );

  engine.addGame(game);

  game.addWorld('main', MainGameMode, MainLevelScript);

  game.start();

  return game;
}
```

在这段代码中，我们首先引入了Sein本身、一个状态类和两个脚本类，之后在`main`函数中我们创建游戏顶层的`Engine`实例，然后根据Canvas引用、一些配置项和游戏状态`GameState`创建了`Game`实例，之后将`game`添加到了`engine`之中，随之为`game`添加了一个`World`并为其指定了全局游戏玩法脚本`MainGameMode`以及默认的关卡脚本`MainLevelScript`，最终调用`game.start`方法来启动游戏，启动后Sein会自动创建默认世界并加载玩法逻辑`MainGameMode`、之后创建默认关卡并加载默认逻辑`MainLevelScript`。  

>注意在React的Game组件的生命周期`componentWillUnmount`中，我们调用`game.destroy`销毁了游戏，这是一个防止内存泄漏的好习惯。

这时候你可能已经开始疑惑：“像是`Engine`、`Game`、`World`乃至`MainGameMode`这种类是用来做什么的？”不要着急，在后续的章节中我将会将整个引擎的设计逐渐披露，当下我们只需要关心一个问题——“我应该如何去为游戏添加基本的玩法逻辑？”或者说“我如何在这个模板上面修改，来达成自己的一些想法？”下面我就这些问题为大家娓娓道来。

## 玩法逻辑

游戏的玩法逻辑(GamePlay)，以模板工程为例，实际存放在在**game/scripts**下面的两个文件(脚本类)内，即`MainGameMode`和`MainLevelScript`。模板工程只存在一个世界和一个关卡，所以这两个脚本分别是“世界的玩法逻辑”和“默认关卡的展示逻辑”。让我们先看看`MainGameMode`的实现：  

```tsx
import * as Sein from 'seinjs';

import GameState from '../states/GameState';

export default class MainGameMode extends Sein.GameModeActor {
  private delta: number;

  public onError(error: Error) {
    console.log(error);

    return true;
  }

  public onAdd() {
    this.delta = 0;
  }

  public onUpdate(delta: number) {
    this.delta += delta;

    if (this.delta > 2000) {
      this.getGame<GameState>().state.changeFloatingSpeed();
      this.delta = 0;
    }
  }
}

```

在这个类中，我们着重处理了三个生命周期（**生命周期**的概念会在后面的章节详细介绍）：在`onError`中，我们处理了传递到这一层级的异常并拦截其继续向上传播（关于**异常边界**，将在后面的章节中详细介绍）；在`onAdd`中，我们初始化了一个私有变量`delta`，而在`onUpdate`中，我们在每一帧计算变量`delta`的值，并凭借其使得从属于`Game`实例的全局状态改变。

再让我们看看`MainLevelScript`的实现：  

```ts
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import FloatingComponent from '../components/FloatingComponent';

export default class MainLevelScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'miku.gltf', url: '/assets/gltfs/miku.gltf'});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state.current, state.progress);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const camera = world.addActor('camera', Sein.PerspectiveCameraActor, {
      far: 1000,
      near: .01,
      fov: 60,
      aspect: game.screenWidth / game.screenHeight,
      position: new Sein.Vector3(0, 12, -25)
    });
    camera.lookAt(new Sein.Vector3(0, 12, 0));

    camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
      enableDamping: true,
      dampingFactor: .2,
      zoomMax: 100,
      zoomMin: .1,
      target: new Sein.Vector3(0, 12, 0)
    });

    const box1 = world.addActor('box1', Sein.BSPBoxActor, {
      width: 2, height: 2, depth: 2,
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0)}),
      position: new Sein.Vector3(-8, 10, 0)
    });
    box1.addComponent('floating', FloatingComponent, {amp: 1, omega: 2});

    world.addActor('box2', Sein.BSPBoxActor, {
      width: 2, height: 2, depth: 2,
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 1, 0)}),
      position: new Sein.Vector3(8, 10, 0)
    });

    world.addActor('aLight', Sein.AmbientLightActor, {
      color: new Sein.Color(1, 1, 1),
      amount: .5
    });
    world.addActor('dLight', Sein.DirectionalLightActor, {
      direction: new Sein.Vector3(0, -1, 1),
      color: new Sein.Color(1, 1, 1),
      amount: 2
    });

    const miku = game.resource.instantiate<'GlTF'>('miku.gltf').get(0);
    miku.transform.setPosition(0, 0, 4);
  }

  public onUpdate() {
    const box2 = Sein.findActorByName(this.getWorld(), 'box2');
    box2.transform.rotate(box2.transform.upVector, .02);
  }
}
```

这个类的逻辑看似比较复杂（其实就比较长），但其实现的逻辑确实十分简单：首先，在生命周期`onPreload`中，我们为整个游戏添加了模型资源`miku.gltf`；之后在`onLoading`中跟踪加载进度；接着在加载完毕后的`onCreate`中创建了摄像机、灯光并实例化了模型`miku`，同时还为摄像机注册了控制器组件`CameraOrbitControlComponent`、为`box1`注册了组件`FloatingComponent`；最终在`onUpdate`中，我们在每一帧先拿到`box2`的引用，并对其进行旋转。

## 游戏状态

上面的两个脚本都涉及到了一个类型为`GameState`的实例，其实际上为挂载在`Game`实例下的状态。在Sein中，我们可以自定义若干的`StateActor`，它们有的服务于顶层`Game`实例，有的服务于`World`，有的服务于`Level`也有灵活服务于玩家或者AI的，通过这些状态类、加上后续会详细介绍控制器，我们可以解耦“视图”、“控制”、“状态”三者，达成一个良好的、复杂度可控的架构。  

让我们仔细看看模板工程的`GameState`类的具体实现：  

```ts
import * as Sein from 'seinjs';

export default class GameState extends Sein.StateActor {
  public floatingSpeedFactor: number = 0;

  public changeFloatingSpeed() {
    this.floatingSpeedFactor = Math.random();
  }
}
```

这个状态类的实现非常简单，其只有一个公有属性`floatingSpeedFactor`和方法`changeFloatingSpeed`，它们成对用于控制一个名为“浮动速度系数”的参数，这个参数被下面要介绍的组件`FloatingComponent`利用，来控制挂载了这个组件的容器的行为。

## 游戏组件

组件是一种特殊的类，其用于给“容器”添加功能，这个容器在Sein中被称为`Actor`，这个在后续的章节会详细介绍。在模板工程中，**src/components**下提供了一个组件`FloatingComponent`，这个组件用于给其父级容器添加上下浮动的功能：  

```ts
mport * as Sein from 'seinjs';

import GameState from '../states/GameState';

export interface IFloatingComponentState {
  componentName?: string;
  position?: Sein.Vector3;
  omega?: number;
  phase?: number;
  amp?: number;
}

export default class FloatingComponent extends Sein.Component<IFloatingComponentState> {
  public initPosition: Sein.Vector3 = new Sein.Vector3();
  public omega: number;
  public phase: number;
  public amp: number;
  
  private component: Sein.SceneComponent;
  private time: number = 0;

  public onAdd(initState: IFloatingComponentState) {
    this.component = this.getOwner().findComponentByName(initState.componentName || 'root');

    if (initState.position) {
      this.initPosition.copy(initState.position);
    } else {
      this.initPosition.copy(this.component.position);
    }
    this.amp = initState.amp || .5;
    this.omega = initState.omega || 1;
    this.phase = initState.phase || 0;
  }

  public onUpdate(delta: number) {
    const transform = this.component;
    this.time += delta / 1000;
    const omega = this.omega * this.getGame<GameState>().state.floatingSpeedFactor;

    transform.position.y = this.initPosition.y + Math.sin(this.time * omega + this.phase) * this.amp;
  }
}
```

在这个组件中，你可以通过类型为`IFloatingComponentState`初始化参数在注册组件时控制器初始状态，并在后续通过其公共属性`omega`等在运行时调整其状态。而组件本身，则是在生命周期`onAdd`中在被实际注册到父级容器中并且容器被添加到游戏世界中时，根据初始化参数来进行初始化行为，之后在`onUpdate`中不断获取父级容器的`transform`并修改其在世界中的位置。

## 下一步

到这里，整个模板工程的逻辑就算解释清楚了，但我明白，这些解释反而会带来更大的疑惑——“`Engine`、`Game`、`World`、`Level`、`Actor`、`Component`、`State`、`GameMode`、`LevelScript`等等等等，这些东西都是什么？” “Sein的整个架构是怎样的？” “我该如何理解引擎各部分的联系？”  

接下来就让我们进入Sein的核心架构部分，不用担心，这部分看似复杂却条理清晰，相信在十分钟之内你就可以完全理解。那么就让我们来论述Sein的整体架构，让大家对其有基本的了解吧——[游戏架构](../architecture)。
