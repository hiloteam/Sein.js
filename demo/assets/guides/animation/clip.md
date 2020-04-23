# 动画片段

AnimatorComponent本身只是一个动画的容器，动画实际的逻辑还是要通过[Animation](../../document/classes/animation)的派生类来具体实现。在实现了具体的动画后，便可以用`animator.register(name, animation)`方法来将其注册到动画组件中进行使用。

## 生命周期

Animation通过几个生命周期来精确控制动画的行为，要实现一个自定义的Animation，只需要重写这些生命周期即可，举个自定义动画的例子： 

```ts
interface ICustomAnimationState extends Sein.IAnimationState {
  speed: number;
}

@Sein.SClass({className: 'CustomAnimation'})
class CustomAnimation extends Sein.Animation<ICustomAnimationState> {
  protected _speed: number = 1;
  protected _current: number = 0;
  protected _loop: number = 0;

  // 初始化
  public onInit({speed}: ICustomAnimationState) {
    this._speed = speed;
  }

  // 启动播放时触发
  public onPlay(currentLoop: number) {
    this._current = 0;
    this._loop = currentLoop;
  }

  // 暂停时触发
  public onPause() {

  }

  // 唤醒时触发
  public onResume() {

  }

  // 启动播放时触发
  public onStop() {

  }

  // 异常链捕获
  public onError(error: BaseException, details: any) {

  }

  // 每一帧更新时触发
  public onUpdate() {
    if (this.paused) {
      return;
    }

    this.actor.transform.rotationY += this._speed * .1 * (this._loop % 2 ? 1 : -1);

    this._current += delta;

    if (this._current >= 1000) {
      this.stop();
    }
  }
}
```

这段代码中的Animation派生类实现了一个通过当前循环次数、使得动画所属actor不断绕着正向或者逆向旋转的逻辑，你可以在这个实例直接查看实际效果：[自定义动画](../../example/animation/custom)。

## 默认动画派生类

Sein中提供了一些基础的动画派生类，使用它们足以应对大部分场景：

1. [TweenAnimation](../../document/classes/tweenanimation)：用于将Tween动画封装到Animation内统一交由组件控制。可见实例[Tween动画](../../example/animation/tween)。
2. [ModelAnimation](../../document/classes/modelanimation)：模型动画，一般不需要自己生成，而是在GlTF模型实例化完毕后自动生成，这个会在后续章节讲到。可见实例[模型动画](../../example/animation/model)。
3. [SpriteAnimation](../../document/classes/spriteanimation)：精灵动画，和精灵配套使用，这个将在下一章讲到。可见实例[2D精灵动画](../../example/animation/2d-sprite)。
4. [CombineAnimation](../../document/classes/combineanimation)：组合动画，用于将多个动画组合起来一起播放，播放结束将以后结束的为准。。

对于组合动画`CombineAnimation`，注意你并不能同时播放多个隶属于同一actor的模型动画！模型动画是互斥的。

## 将动画链接起来

不光光是注册单个动画，`AnimatorComponent`还内置了一个状态机，用于将一系列注册过的动画连接起来，让其在满足一定条件时自行跳转结合，形成复杂动画。来看个例子，假如我们已注册了`anim0`、`anim1`、`anim2`、`anim3`四个动画：  

```ts
animator.addTransition('anim0', 'anim1', params => params.to === 1);
animator.addTransition('anim0', 'anim2', params => params.to === 2);
animator.addTransition('anim0', 'anim3', params => params.to === 3);
animator.setParameter('to', 2);

sein.animator.play('anim0');
```

这段代码中，我们使用了`animator.addTransition`方法来链接两个动画，并使用第三个参数中的回调，来让其通过当前的参数来决定切换到哪个动画。比如在下面我们用`animator.setParameter`方法将`params.to`设定为了`2`，那么在`anim0`播放完毕后便会继续播放`anim2`动画。  

可见实例[动画组合](../../example/animation/combination)