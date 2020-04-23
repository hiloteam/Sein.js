# 事件管理器

事件系统，本质上可以看做是游戏世界中的“口”和“耳”，Actor们通过它事件系统进行信息的传递，以此来实现交流。对于前端开发者而言，事件系统并不陌生，比如下面这段代码：  

```ts
window.addEventListener('resize', () => console.log(window.clientWidth, window.clientHeight));
```

这段代码中，我们监听了窗口大小的变化，于是能够在其每次触发时答应窗口的宽度和高度。Sein的事件系统和这个并没有本质上的不同，但拥有很多更加贴近于游戏的设计。

事件管理器是管理一套事件机制的核心容器，其实现于类[EventManager](../../document/classes/eventmanager)中。事实上，在游戏世界的各个角落，你都可以看到`EventManager`的身影。比如游戏的全局事件`game.event`，在比如每个组件自带的事件`component.event`等等，

>注意，Actor也有自身的`event`属性，不过这是被代理到其根级Component的`event`上的。

让我们通过一段代码，来了解一下事件管理器的具体使用：  
 
```ts
function listen(args) {
  console.log(args);
}

// 手动注册事件
game.event.register('test');

// 添加监听器
game.event.add('test', listen);

// 仅仅监听一次，触发后自动移除
game.event.addOnce('test', args => console.log(args, 'once'));

// 触发，两句输出
game.event.trigger('test', {info: 'haha'});

// 触发，一句输出
game.event.trigger('test', {info: 'haha'});

// 取消注册并触发，会引起异常
game.event.unregister('test');
game.event.trigger('test', {info: 'haha'});

// 自动注册事件并触发
game.event.add('test', listen);
game.event.trigger('test', {info: 'haha'});

game.event.remove('test', listen);
```

在这段代码中，我们首先利用`register`注册了事件`test`，使其存在于事件管理器中，之后用`add`方法为`test`事件添加了一个监听方法`listen`，并通过`addOnce`添加了一个一次性的监听方法，再之后通过参数触发了这个事件，此时控制台会有两句输出。  

接下来我们取消了`test`事件的注册并接着触发，此时事件管理器找不到这个事件，于是会抛出异常。再之后我们在没有执行`register`的情况下直接使用了`add`添加监听函数，此时事件管理器会自动注册一个新的`test`事件，使得下一步触发正常执。最终，我们使用`remove`移除了监听函数，再触发时间后不会有任何信息输出。

## `register`和`add`

这里你可能会疑惑：既然`add`可以自动注册事件，那么`register`的存在又有什么意义？意义当然是有的。前面说过，每个Component都会有自己的事件管理器`event`，而有时候我们会给一些Component添加一些事件供外部调用者使用，但又不想去提供一个多余的监听函数，比如动画组件，这时候就`register`就很有用。  

还有另一种情况也需要`register`方法——我们的事件不总是手动触发的，比如下面会提到的全局事件中的`Resize`，它其实是监听`window`的`resize`事件来完成的。这个时候我们就需要另一套机制来注册事件，这个将由下面的**事件触发器**一节详细说明。

## 细究事件触发机制

一般我们通过`event.trigger`方法来手动触发一个事件，一般情况下调用这个方法只需要传递两个参数——事件的类型`type`和回调事件参数`event`，但其实还有第三个参数`immediately`，他决定着此次事件触发是否是会被**立即广播**，它的默认值为`true`，也就是说大多数事件都是立即广播的。  

那么立即广播和不立即有什么区别？通过前面各个容器和Actor、Component的生命周期，我们知道游戏中是有“帧”这个概念的，游戏中在`onUpdate`中的逻辑以及渲染都是在每一帧来执行的。对于一些事件，我们希望是进行**帧同步**的，也就是无论事件在何时触发，都将其延迟到每一帧的逻辑执行前进行。比如对于鼠标
、键盘这些事件，两帧之间可能会有多次相同类型事件的触发，而往往我们是不需要这种额外的事件开销的，这时候就需要帧同步来做。  

第三个参数`immediately`就用来控制事件是否需要帧同步，如果为`true`（默认），那么不进行帧同步，立即广播，如果是`false`则将会延迟。

## 指定事件类型

有些状况下我们需要作为封装者封装Component给他人使用，而这些Component自身可能本身就由一些默认事件，在这种情况下，如果类型推断能帮我们告知开发者当前所拥有的事件类型和回调参数，那么开发成本会降低不少。事实上，事件管理器提供了这个能力，你可以通过指定其泛型参数来搞定这事：  

```ts
class TestComponent extends Sein.Component {
  // 直接指定保护属性，通过类型推断
  protected _event: Sein.EventManager<{
    test: {info: string}
  }>

  // 或者直接指定访问器的类型
  get event() {
    return this._event as Sein.EventManager<{
      test: {info: string}
    }>;
  }

  // 预先注册事件

  public onInit() {
    this.event.register('test');
  }
}
```

如此一来，在调用者使用这个组件的`component.event`的`add`、`remove`等方法时，IDE就可以自动推断出`test`这个字符串来作为第一个参数的自动补全，也可以推断出后面的回调参数类型。在核心组件中，`AnimatorComponent`、`RigidBodyComponent`等就拥有自身的预定义事件。  

>注意，事件管理器的事件类型指定仅对自动补全有效，它是利用重载来实现的，并不能保证类型安全。
