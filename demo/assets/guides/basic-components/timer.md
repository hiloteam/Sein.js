# 定时器

定时器在游戏开发中属于常见的功能，其常用于倒计时、定时任务触发等。Sein内核提供了一个基本的定时器供开发法者使用，当然——它也是一个Actor。  

## TimerActor

Sein中的定时器类是[TimerActor](../../document/classes/timerActor)，其封装了一系列方法和事件来方便地实现定时功能，使用方法也很简单：  

```ts
const timer = game.addActor('timer', Sein.TimerActor);
timer.event.add('Step', ({current}) => {
  console.log(current);
});
timer.start(10, 1000);
```

以上代码添加了一个定时器Actor`timer`，之后添加了事件`Step`，其会在定时事件的每一步进行触发，最后使用`start`方法启动了定时，第一个参数是定时的步数、第二个则是每步之间的市场(毫秒)。  

注意事件回调的参数，其保存了定时的一些状态，分别有当前步数`current`、总次数`times`和两步之间的间隔`timeStep`。

### 更高级的操作

在实际使用中，我们还需要更多的功能，TimerActor提供了更多的方法和事件来完成它们。使用`pause`和`resume`事件，我们可以暂停以及从暂停的时刻唤醒定时器；使用`stop`可以完全停止定时器，此时的定时器只能通过`start`重新启动。针对不同状态，定时器也提供了不同的事件来对外通知，定时启动时有`Start`、暂停时`Pause`、唤醒时`Resume`、每一步时`Step`、结束时`End`。

### 实例

你可以在这个实例查看定时器的实际运作：[定时器](../../example/core/timer)。
