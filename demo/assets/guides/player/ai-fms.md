# AI和状态机

AI不同于玩家，其单纯和当前游戏世界内的实例有关，所以并不需要一个更高层的视角来跨越世界。

## AIControllerActor

`AIControllerActor`目前和标准的`ControllerActor`并没有什么区别，后续可能会添加默认的状态机或者行为树，但目前还是交由开发者自行考虑。

关于AIControllerActor的一个简单应用，可见实例[AI](../../example/player/ai)。

## 状态机组件

Sein提供了默认的标准状态机组件来实现状态机编程，状态机是标准的AI编程模型之一，可分为标准状态机以及分层状态机。关于状态机的原理这里不再赘述，Sein中提供了有限状态机组件[FSMComponent](../../document/classes/fmscomponent)，下面就给出一段具体的使用例子：  

```ts
const fsm = controller.addComponent('fsm', Sein.FSMComponent);

fsm.addState('moving', {
  onEnter: () => animator.play(ANIMATIONS.RUN, Infinity),
  onUpdate: () => {
    const {state} = this;

    transform.translate(state.forward, .01);
    state.hurt(0.05);
    state.move(.01);

    if (state.isTired) {
      fsm.dispatch('REST');
    }
  }
});

fsm.addState('rest', {
  onEnter: () => {
    animator.play(ANIMATIONS.SIT_DOWN);
    animator.event.addOnce('End', () => animator.play(ANIMATIONS.SIT_DOWN_IDLE, Infinity));
  },
  onUpdate: () => {
    const {state} = this;

    state.recover(0.05);

    if (state.isFullPower) {
      fsm.dispatch('MOVE');
    }
  }
});


fsm.addTransitions([
  {from: ['enter', 'rest'], to: 'moving', action: 'MOVE'},
  {from: ['enter', 'moving'], to: 'rest', action: 'REST'}
]);

fsm.dispatch('MOVE');
```

这端代码中我们给控制器`controller`添加了一个FSM组件，通过`addState`为其添加了`moving`和`rest`两种状态，分别定义了进入状态和在状态中时更新的逻辑，同时通过`addTransitions`定义了允许进行的状态跳转以及用于触发的`action`。这里假设我们控制器已经有个`StateActor`来记录其控制其的`actor`的状态，可以看到在`actor`移动时其会不断扣除生命值，归零时进入休息状态，而休息时会不断恢复，回复满继续移动。  

这个状态机很简单，但却基本可以体现出其能力，更多功能还请翻阅文档。

## 行为树

行为树组件还在规划中，目前准备不在内核中集成，而是通过扩展的方式提供。
