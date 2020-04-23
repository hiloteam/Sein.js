# 异常系统

异常处理，不仅仅在游戏引擎中，在所有应用中都是一个痛点。对于异常的处理在编程语言中也有各种不同的声音，但基本可以分为两个流派——抛异常和不抛异常派。  

抛异常派建议使用`throw`或类似方式来使用异常处理程序的错误，它们认为这样可以提高可读性并且可以在顶层捕获，方便统一管理。

不抛异常派则认为`throw`这个行为本质上就是一个风险漏洞——首先它本质上是一种`goto`，会打乱程序流，其次你并不能保证程序员可以细心到捕获任何异常，这使得其非常容易被滥用。并且在C++这种自己进行内存管理使的语言，使用不当还可能出现各种诡异的状况，这一点在有大量第三方库的项目中尤为严重。所以这一派倾向于使用`ErrorCode`或者等价方式来表达错误，典型如Rust语言，你可以指定返回值为`Option`类型并强制提醒你用`match`或者`unwarp`来检查返回值中的错误。  

这两种方式当然更有优劣，虽然我理智上倾向于后一种严格规范的表达方式，但作为一个本质上基于JS的引擎，我们仍然无法杜绝`throw`的状况，再者抛异常这种形式确实更适合快捷开发（虽然有一些风险）。在权衡之下，Sein一定程度上借鉴了React的**Error boundaries**，即“异常边界”的思想，综合了两种处理方式的一些优点，构成了一个完整的异常系统。

## BaseException

在Sein中，所有进入到异常系统的的异常，都派生于或者被转换为[BaseException](../classes/baseexcption)。它继承自标准`Error`类，并在初始化和功能上有一些定制。  

`BaseException`以及其派生的几种异常比如[TypeConflictException](../classes/typeconflictexception)都在初始化时都需要提供一个类型为`SObject`的`object`参数，这个`object`用于做异常对象的追踪，最终会被存储到`objectStack`中。

`objectStack`是`BaseException`特有的一个公有属性，其仅在开发环境会被赋值，存储的实际上是一个`SObject`的栈，栈中的每个SObject通过`parent`属性互相连接，以`object`参数为起始，逐级向父级递归查找。  

所以，在开发模式中，捕获到一个`BaseException`后，你可以取得其`objectStack`来查看异常对象栈。

## onError与异常链

有了基础的异常，就需要一个捕获的方式。传统的`try-catch`有许多弊端，我们必须有一种方式来替代它进行更好的捕获——首先，这种新的方式可以全部捕获任意角落的任意异常；其次，这些异常最好还能由开发者决定在什么地方集中捕获；最后，我们还希望能够控制异常的上报链路，即时对其进行截断。

Sein中大多类的都拥有的生命周期`onError`就提供了这个能力，让我们来直接看一个例子：

```ts
interface IStateTypes extends Sein.ISceneComponentState {
  info: string;
}

class CustomComponent extends Sein.Component<IStateTypes> {
  public onError(error: Sein.BaseException, details?: any) {
    console.log('Component', error, details);
  }

  public onDestroy() {
    throw new Error('Just emit an error, it could be handled from component to top level game.');
  }
}

class CustomActor extends Sein.SceneActor<IStateTypes> {
  public onError(error: Sein.BaseException, details?: any) {
    console.log('Actor', error, details);
  }
}

class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    console.log('onCreate(LevelScript)');
    const actor = game.world.addActor('customActor', CustomActor, {info: 'Hello Actor !'});

    actor.addComponent('customComponent', CustomComponent, {info: 'Hello Component !'});
    actor.removeComponent('customComponent');
  }

  public onError(error: Sein.BaseException, details?: any) {
    console.log('LevelScript', error, details);
  }
}

class MainGameMode extends Sein.GameModeActor {
  public onError(error: Sein.BaseException, details?: any) {
    console.log('GameMode', error, details);
  }
}
```

以上例子可以直接在示例页面[异常链](../../example/core/error-chain)查看。在这段代码中，我们创建了一个必定会在被移除时抛出异常的组件`CustomComponent`，之后在`MainScript`中将其注册给了一个`CustomActor`的实例，之后立即移除它，以实现异常的触发。在异常被触发后，由于从Component到逻辑顶层的`MainGameMode`到最顶层的`Engine`的级联关系，异常将会在每一级向上传递，并触发它们的`onError`生命周期。  

这其实就是**异常链**。异常可以在任何一个`SObject`中被触发，之后通过它以及它父级的`parent`属性逐级向上传递，最终可能到达`Engine`，而在这个过程中，它会不断触发具有`onError`生命周期的实例的该周期，来使得开发者便利的捕获它们。

>在开发模式下，控制台会直接以**红底红字**输出当前的异常链，比如在此例中就是`Stack: Component(customComponent) -> SceneActor(customActor) -> Level(persistent) -> World(main) -> Game(intro-game) -> Engine(SeinEngine)`，你可以直接在上面的例子中打开控制台查看。  

>一定注意，**不要在`onError`中再次抛出异常！！！**

### 异常拦截

在大多默认情况下，异常最终都会被传递到顶层`Engine`并仍然在最后被抛出，来使得整个游戏终止。很多情况下我们不希望如此——我们希望的只是在某个逻辑顶层（通常是`GameModeActor`或`Game`实例中）捕获异常，并且根据异常信息来判断仅仅是上报静默处理，还是明确得终止它。这就需要有个方式来对异常链进行拦截终止，Sein通过指定`onError`方法的返回值来实行拦截，让我们回顾一下此方法的声明：  

```ts
class Component {
  onError(error: Error, details?: any): void | boolean;
}
```

`onError`可以返回`void`或者`boolean`类型的值，当且仅当显式返回`true`时，异常链会被拦截，不再向上传递。

## 同步异常与异步异常

在Web开发中，我们常常就逻辑分为同步和异步两种。  

同步逻辑产生的异常捕获起来非常简单，直接`try-catch`即可。在Sein的异常系统中，任何一个**在生命周期内部抛出的同步异常**都会被自动捕获并传递到异常链中。

而异步逻辑，即回调、Promise、async/await这些方式产生的异常，由于其特殊性，我们没有办法自动捕获。Sein提供了一个方法用于给开发者手动将此类异常加入异常链中，即`Sein.throwException: (error, errorObject, errorDetails) => void`方法。  

`throwException`方法提供的三个参数中，第一个即错误本体，它可以是原始错误类型`Error`的实例（将会被自动转换为`BaseException`）、可以直接是`BaseException`；第二个参数是引发异常的实例，可以是任何一个`SObject`的派生类；最后一个参数为异常的详情，你可以用过其传递你想传递给开发者的信息，它将会在`onError`的第二个参数中被传递。
