# 宏观动画

要让整个游戏世界生动起来，动画必不可少。Sein中提供了一套动画解决方案，可以在宏观层面、也可以作为组件使用。

宏观层面的动画有多种实现方式，但总结起来无非两种——通过脚本中的`onUpdate`周期不断更新某个属性，或者使用`Tween`来编写带有插值曲线的动画。

## 在脚本中编写

这种方法很简单，举个例子就能明白：  

```ts
class MainLevelScript extends Sein.LevelScriptActor {
  public onUpdate(delta: number) {
    this.box.transform.rotationX += delta * 0.001;
  }
}
```

这段代码中假设关卡脚本中生成了一个立方体Actor，之后在`onUpdate`周期内不断去修改其`rotationX`来让它旋转。由于逻辑完全由开发者控制，所以这种动画十分灵活。

## Tween

Tween用于实现插值动画，其使用也是非常方便：  

```ts
Sein.Tween.to(
  {step: 0},
  {step: 6.28},
  {
    ease: Sein.Tween.Ease.Quart.EaseInOut,
    duration: 2000,
    delay: 1000,
    loop: true,
    repeat: 10,
    repeatDelay: 100,
    onUpdate: (_, {target}) => {
      console.log(target.step);
      this.box.transform.rotationY = target.step;
    },
    onComplete: () => console.log('Complete')
  }
);
```

这段代码展示出了Tween动画的基本使用，其利用初始值、终点值、动画插值曲线、动画时长、动画起始延迟、循环开关、循环次数、更新回调、结束回调等等参数，精确控制动画中每一帧的更新。在这个例子中，就实现了让立方体从0开始，以`Quart.EaseInOut`曲线插值、绕Y轴旋转一圈的动画。
