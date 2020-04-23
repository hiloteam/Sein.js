# Actor和Component

作为Sein中游戏世界的基石，Actor的派生类承载着几乎游戏中所有的业务逻辑功能，而Component作为通用逻辑的封装，也帮助Actor解决了不少问题。同时由于每个Actor都必然拥有一个根级Component（根组件），所以在很多情况下也可以将某些没有承载业务逻辑的Actor看作是某特定Component的一层封装而已。Actor和Component的共生带来了很好的便利性和扩展性，也是的代码层次更加清晰。

## Actor

在Sein中，你可以认为整个游戏世界就是一个话剧舞台，而Actor则是在上面表演的演员、背景的道具、灯光、声音甚至是剧本等等，构成这个舞台的基本要素的抽象体现。而在代码逻辑中，Actor可以视作是一个带有通用生命周期的基础容器，理论上一个实现了生命周期并且拥有添加Component能力的容器都可以看做是一个Actor（当然在实际实现中我们选用的是继承手段），让我们先来看一段代码：

```ts
interface ICharacterActorOption {
  // 角色萌属性
  moe: '傲娇' | '三无' | '妹妹' | '大姐姐';
};

@Sein.SClass({className: 'CharacterActor'})
class CharacterActor extends Sein.InfoActor<ICharacterActorOption, Sein.Component> {
  public moe: ICharacterActorOption['moe'];

  // 仅在开发环境下，验证是否允许继续添加，一般用于全局系统，大部分时候呀用不到
  public verifyAdding() {
    if (Sein.findActorByClass(this.getGame(), CharacterActor)) {
      throw new Error('只能拥有一个CharacterActor');
    }
  }

  // 仅在开发环境下，验证是否允许移除
  public verifyRemoving() {
    throw new Error('不允许移除');
  }

  // 在Actor创建之时就被调用了，替换掉默认的根组件，一般不需要自行替换
  public onCreateRoot(initOptions: ICharacterActorOption) {
    return super.onCreateRoot(initOptions);
  }

  // 在Actor创建之后立即注册一个事件
  public onInit(initOptions: ICharacterActorOption) {
    this.event.register('Speak');
  }

  // 在Actor被实际添加到游戏中时，将初始化参数的`moe`保存下来
  public onAdd(initOptions: ICharacterActorOption) {
    this.moe = initOptions.moe;
  }

  // 在每一帧更新时都触发一个事件
  public onUpdate(delta: number) {
    this.event.trigger('Speak', '喵');
  }

  // 在每一帧更新时都触发一个事件
  public onUpdate(delta: number) {
    this.event.trigger('Speak', '喵');
  }

  // 在被`unLink`时触发。
  public onUnLink() {

  }

  // 在Actor销毁前触发
  public onDestroy() {

  }
}
```

在这段代码中，我们自定义了一个`InfoActor`的派生类，并为其编写了逻辑，这里需要注意的是两个泛型参数和几个生命周期。泛型参数`ICharacterActorOption`代表初始化参数类型，`Sein.Component`则代表Actor的根组件的类型（默认有值）。生命周期则是代表了一个Actor存在的几个不同的阶段，具体见上面代码的注释和文档[Actor](../../document/classes/actor)。

### 添加和移除

有了Actor，我们就要想办法把它放入游戏中。前面说过Actor会区分为不同的种类，有不同的归属，这里的Actor派生自`InfoActor`，所以只能被添加到`Game`中，我们就先看看如何将这个Actor添加到`Game`中以及如何移除它：  

>有关`InfoActor`和`SceneActor`的区分，后面会细讲，读者此处不需要过于关注。

```ts
const sakura = game.addActor('sakura', CharacterActor, {moe: '大姐姐'});

game.removeActor(sakura);
```

这两句代码功能明确，第一句指定了`CharacterActor`为类、`{moe: '大姐姐'}`为类型，添加了名为`sakura`的<del>美少女</del>对象到`game`中，第二句则是通过其引用在`game`中对其移除。  

>注意这里由于定义之时指定了`CharacterActor`的初始化参数类型的泛型，`sakura`的类型以及初始化时`addActor`的最后一个参数会被自动推断。

### 查找

很多时候我们都需要去在`Game`或者`World`中搜索一个或多个Actor，关于如何在游戏中搜索一个特定的Actor，请看后续[归类和搜索](../functions/search)章节。

### UnLink与ReLink

在游戏开发中，我们有时候只需要把一个Actor从世界中移除掉，但并不想完全从内存中销毁它。这样下次就可以快速将其再次添加到世界中而不用重新创建，同时能保留其上次的状态。Sein提供了这个能力，其利用`actor.unLink`和`actor.reLink`方法以及生命周期`actor.onUnLink`和`actor.onReLink`实现。  

同时Component也拥有生命周期`onUnLink`和`onReLink`，他们会和父级`actor`的同名生命周期同步触发。  

利用`unLink`和`reLink`，可以实现进行一些性能优化，比如对象池技术，这个会在[优化](../optimizing)一节详细论述。也可以用于实现一些效果，比如实例[UnLink和ReLink](../../example/core/unlink-relink)。

## Component

组件`Component`是表达一个特定可复用功能的逻辑块，其承载着几乎所有的非业务逻辑，可以自由得在Actor上进行插卸。类比上面的话剧例子，组件可以是演员身上的衣服、灯光外部的装饰等等。在这里同样，让我们用一段代码来举个例子：

```ts
interface IHelloComponentState {
  sayOnInit: boolean;
};

@Sein.SClass({className: 'HelloComponent'})
class HelloComponent extends Sein.Component<IHelloComponentState> {
  // 仅在开发环境下，验证是否允许继续添加
  public verifyAdding() {
    if (this.getOwner().findComponentByClass(HelloComponent)) {
      throw new Error('只能拥有一个HelloComponent组件');
    }
  }

  // 仅在开发环境下，验证是否允许移除
  public verifyRemoving() {
    throw new Error('不允许移除');
  }

  // 在Component创建之后触发
  public onInit(state: IHelloComponentState) {

  }

  // 在Component被实际加入到游戏中时，根据初始化状态说明是否要一开始就说Hello
  public onAdd(state: IHelloComponentState) {
    if (state.sayOnInit) {
      this.hello();
    }
  }

  // 在每一帧更新时
  public onUpdate(delta: number) {

  }

  // 在父级Actor被`unLink`是触发
  public onUnLink() {

  }

  // 在父级Actor被`reLink`是触发
  public onReLink() {
    
  }

  // 在Component销毁前触发
  public onDestroy() {

  }

  public hello() {
    const moe = this.getOwner().moe;

    switch (moe) {
      case '傲娇':
        console.log('哼，人家才不想看到你呢！')
      case '三无':
        console.log('......!')
      case '妹妹':
        console.log('哥哥早上好！')
      case '大姐姐':
        console.log('起的这么早呀，不多睡会吗，我还在做早饭呢~')
    }
  }
}
```

在这里，我们自定义了一个组件，并通过指定泛型参数`IHelloComponentState`约束了其初始化状态，之后再重写了其一系列生命周期来完成我们的逻辑。这里尤其要注意Component和Actor不同，一个Actor下的所有Component的名字`name`都是唯一的，并且你可以通过`verifyAdding`和`verifyRemoving`方法来在开发环境下验证组件是否可添加或移除，来达到对组件使用者更强的约束（比如A组件依赖于B组件）。生命周期和Actor大同小异，无需多言，但和Actor一样，Component也提供了几个特有的属性来对其进行更细致的控制：`updateOnEverTick`决定组件是否要在每一帧更新，`needUpdateAndDestroy`则是决定组件是否要加入更新和销毁队列，对于很多单纯的展示型组件（比如模型），利用这个属性能达到不错的优化，`canBeRemoved`则是在生产阶段也能指定组件不可移除的一个属性。

### 注册和移除

同样，我们也通过一段代码来说明如何注册一个组件、并移除它：

```ts
const hello = sakura.addComponent('hello', HelloComponent, {sayOnInit: true});
hello.hello();

sakura.removeComponent(hello);
// or
sakura.removeComponent('hello');
```

在这段代码中，我们先通过指定组件类`HelloComponent`和初始化参数注册了一个组件，之后调用了它的一个方法，最后移除了它。由于组件名字是唯一了，除了引用，你也可以通过名字来移除它。

### 事件

同时每个组件都拥有自己的事件管理器，而`Actor`的事件管理器则是直接代理到根组件的，这个后面会有一章单独讲到。

### 根组件

前面我们提到过**根组件**的概念，也提到过`Actor`可以看做仅仅是`Component`的一个封装（只不过它自己也可以拥有逻辑，这又带来了很大的灵活性），所以每个`Actor`都有其对应的根组件，对于一些特殊的`Actor`则有特殊的`Component`，比如`SceneActor`的根组件是`SceneComponent`、`StaticMeshActor`根组件是`StaticMeshComponent`。

根组件可以直接通过`actor.root`获取，也可以用actor下的component的`component.getRoot()`方法直接获取，后面会详细说到这些内置的特殊`Actor`和根组件。

### 查找

关于如何在Actor中搜索一个特定的Component，请看后续[归类和搜索](../functions/search)章节。
