# 事件触发器

前面提到过事件注册的另一种方法，其不通过手动触发，而是利用**事件触发器**这种特殊机制进行自动触发。事件触发器由一个基类[EventTrigger](../../document/classes/eventtigger)以及其派生类构成。下面就由游戏默认全局事件中的`Resize`为例，看看我们是如何实现一个触发器的：  

## 自定义触发器

```ts
@SClass({className: 'WindowResizeTrigger'})
export default class WindowResizeTrigger extends EventTrigger<never> {
  public isMouseEventTrigger = true;
  public autoFlush = false;

  public onBegin() {
    window.addEventListener('resize', this.trigger);
  }

  public onTrigger(event: never) {
    super.onTrigger(event);
  }

  public onPause() {
    window.removeEventListener('resize', this.trigger);
  }
}
```

这段代码列举了对于自定义事件触发器最重要的三个重写方法和一个属性：  

1. `onBegin`：在这里面可以执行事件的初始化，比如这里就监听了`window`的`resize`事件，将事件绑定到一个触发器默认的方法`trigger`中，其会在**事件被注册后且第一个监听器被添加**时被触发，这也是为了避免多余的性能开销。
2. `onTrigger`：会在触发器对应的事件被实际触发时调用，它的默认行为是开始广播全局事件，所以在重写时别忘了执行`super.onTrigger`来执行默认行为，你可以在这里做一些自定义的工作，比如禁止DOM事件冒泡（`event.preventDefault`）等，这可能会在鼠标、键盘等事件时被用到。
3. `onPause`：用于释放触发器，一般会在事件被取消注册时触发，在**最后一个监听器被移除**时也会触发，这同样是为了性能开销。
4. `autoFlush`：指明是否需要立即广播，等同于`event.trigger`的`immediately`参数，若为`false`则为帧同步事件。

定义好了触发器，我们便可以简单地使用它：

```ts
game.event.register('Resize', WindowResizeTrigger);
```

如此，便可以通过`game.event.add('Resize', callback)`来监听窗口大小的变化了。

更详细的例子可见[自定义触发器](../../example/event/custom-trigger)，这里通过事件触发器实现了一个定时器。
