# 拾取

拾取操作，即通过点击/触摸画布中的一点，来拣选出一个具体的Actor。Sein中的拾取基于物理引擎，出于性能考虑，开发者必须启用物理引擎并且为需要被拾取的Actor至少添加一个碰撞体组件，才能使得该Actor被拾取到。  

## 原理

拾取的原理很简单，首先我们在画布上通过触摸/点击选中一个像素，然后通过这个像素换算出该像素屏幕空间对应的坐标，之后在变换到世界空间，加上一个长度来生成一个射线，而这个射线本质上是一个特殊的碰撞体，拾取的整个过程就相当于一次碰撞检测。  

在Sein中，这些底层细节都被封装了起来，你只需要使用[PhysicPicker](../../document/classes/physicpicker)类便可以灵活应对各种各样的场合。

## PhysicPicker

PhysicPicker类将拾取操作完美封装成了一系列顶层的接口，在大部分应用中，你只需要做出简单的配置就可以使用了：  

```ts
const picker = new Sein.PhysicPicker(game);
picker.enablePicking();
```

在这里我们创建了一个`picker`，并调用`enablePicking`方法使其生效，之后我们只需要监听世界内Actor的`Pick`事件即可获知其是否被拾取了：  

```ts
actor.rigidBody.event.add('Pick', ({actor, distance}) => console.log('Pick', actor, distance));
```

你可以在这个实例实际体验一下：[拾取](../../example/physic/pick)。  

## 高级设置

但默认的、简单的拾取操作可能满足不了我们的需求，所以`enablePicking`提供了一个参数`options`来做更多配置，当然你也可以直接修改`picker.options`的值来进行设置。这个参数的类型接口为[IPickOptions](../../document/interfaces/ipickoptions)，下面就几个比较重要的参数来做说明：  

1. type：可选`'up'`、`'down'`或`'custom'`，这个是拾取的触发模式，`up`和`down`决定是在鼠标/触摸开始还是释放时触发，`custom`则不会自动触发，需要用户自己编写触发逻辑，这个将在下面一节说明。
2. mode：拾取模式，默认为`EPickerMode.CLOSEST`，只拾取离相机最近的，性能最好，在一些状况下可能需要`EPickerMode.All`来拾取所有刚体。
3. bodies：限定拾取的刚体组件范围，当确定需要拾取哪些Actor时，可以进行性能优化。
4. filter：拾取过滤器，这个下面会讲到。
5. rayLength：用于拾取的射线长度，默认为100，如果不够需要自己去设置，超了的话也可以自己改短来提高性能。

其他还有一些参数的使用看注释就很清晰了，不再赘述。

## 自定义

当`options.type`设置为`'custom'`的时候，就需要开发者自己来实现拾取逻辑，这提供了很大的灵活度，还是让我们来看一段代码，体会一下这个功能如何运作：  

```ts
class MainGameMode extends Sein.GameModeActor {
  private picker: Sein.PhysicPicker;
  private touchStartPosition: {x: number, y: number} = {x: 0, y: 0};

  public async onAdd() {
    const game = this.getGame<GameState>();

    this.getWorld().enablePhysic(new Sein.CannonPhysicWorld(
      CANNON,
      new Sein.Vector3(0, 0, 0)
    ));

    this.picker = new Sein.PhysicPicker(game);
    this.picker.enablePicking({type: 'custom', rayLength: 100});

    game.hid.add('TouchStart', this.handleTouchStart);
    game.hid.add('TouchEnd', this.handleTouchEnd);
    game.hid.add('TouchCancel', this.handleTouchEnd);
  }

  private handleTouchStart = (event: Sein.ITouchEvent) => {
    this.touchStartPosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  private handleTouchEnd = (event: Sein.ITouchEvent) => {
    const game = this.getGame<GameState>();

    const {x: sx, y: sy} = this.touchStartPosition;
    const {clientX: ex, clientY: ey} = event.changedTouches[0];

    const dx = ex - sx;
    const dy = ey - sy;

    if (Math.abs(dy) < 5 && Math.abs(dx) < 5) {
      const {left, top} = this.getGame().bound;
      const x = ex - left;
      const y = ey - top;

      this.picker.pick(x, y);
    }
  }
}
```

这段代码的逻辑很简单，我们给触摸绑定了事件，在用户按下时开始跟随，释放时进行判断，如果起始位置和释放的位置在5像素范围内则判定为成功，进入拾取触发逻辑。而触发逻辑也很简单，就是一句`picker.pick(x, y)`而已，其中`x`和`y`即像素在当前画布中的位置。

## Filter

虽然以上功能看起来已经足以满足所有需求，但现实总是复杂的。想象这么一个场景：  

我们有A、B、C三种物体，每种都有若干个，在游戏时，它们两两之间都可能互相遮挡，现在有这么个需求——要求无论在什么状况下，当玩家点击屏幕时，总是优先触发B的拾取事件，当没有B时再触发A的，最后是C的。  

在这种情况下，无论是那种`mode`都无法满足我们的需求，`collisionFilterMask`也没办法做到如此灵活，所有我们需要一个函数，可以由它来过滤最终的拣选结果，这就是`options.filter`：  

```ts
picker.options.filter = (results: Sein.IPickResult[]) => {
  const array = (new Sein.SArray()).fromArray(result);

  let result = array.findByClass(B);
  if (result) {
    return [result];
  }

  result = array.findByClass(A);
  if (result) {
    return [result];
  }

  result = array.findByClass(C);
  if (result) {
    return [result];
  }

  return [];
};
```

这段代码性能不行，但已然体现了逻辑，我们通过`filter`函数，对拾取的结果进行了过滤，最后真正需要触发`Pick`事件的结果。  


你可以通过不断重新设置`options`中的参数，来获取想要的各种功能。
