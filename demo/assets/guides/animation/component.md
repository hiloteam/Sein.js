# 动画组件

在宏观层面定义动画时方便而灵活的，但也有其局限性。这种见缝插针式的写法，一是动画一多便会使得代码显然臃肿繁杂，二是难以确定动画的归属。针对这些问题，Sein提供了一个更好的方法——这就是动画组件[AnimatorComponent](../../document/classes/animatorcomponent)。  

>当然，这并不是说宏观层面的动画一无是处，有时候我们不得不在使用这种灵活性，或者在一些小地方无伤大雅，还是要看需求。

## 定义和使用

AnimatorComponent是一种特殊的组件，和刚体组件一样，其具备唯一性和强功能，所以在将其添加到一个actor后可以直接使用`actor.animator`来获取它。此组件提供了一系列方法，来实现对动画的注册、播放、暂停、停止以及事件的管理，让我们来看个例子：  

```ts
box.addComponent('animator', Sein.AnimatorComponent);

box.animator.register('tween', new Sein.TweenAnimation({create: onComplete => Sein.Tween.to(
  {step: 0},
  {step: 6.28},
  {
    onUpdate: (_, {target}) => {
      console.log(target.step);
      box.transform.rotationY = target.step;
    },
    onComplete,
    duration: 2000
  }
) as Sein.Tween}));

box.animator.play('tween', 10);
box.animator.pause();
box.animator.resume();
box.animator.stop();
```

这段代码展示了动画组件的基本使用。我们首先为立方体Actor添加了组件，之后通过`register`方法注册了一个动画（暂且不管这个动画是什么），之后用`play`方法通过动画名字和循环次数来启动播放，之后用`pause`、`resume`和`stop`依次进行了暂停、唤醒、停止操作。  

## 事件

和刚体组件一样，动画组件也提供了一系列事件，用于通知动画播放的具体状态，这些事件包括播放开始`Start`、暂停`Pause`、唤醒`Resume`、循环`Loop`和结束`End`，事件回调的参数类型均为[IAnimatorEvent](../../document/interfaces/ianimatorevent)。
