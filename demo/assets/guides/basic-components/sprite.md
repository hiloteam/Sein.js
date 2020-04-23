# 2D精灵

2D精灵在游戏开发中十分常见，其本质上是一个特殊的PlaneMesh实例，即一个平面正方形加上一个贴图，一般用于实现特效、公告牌等效果。

## 和Unity结合

下面介绍的都是如何在引擎中直接使用图集和精灵，如果想整合进Unity工作流，请见[Unity中的图集和精灵](../scene-editor/atlas-sprite)。

## SpriteComponent和SpriteActor

2D精灵和核心是组件[SpriteComponent](../../document/classes/spritecomponent)，它提供了基本的2D精灵绘制能力，而`SpriteActor`则是其一个简单封装。以实例[2D精灵](../../example/render/2d-sprite)的代码为例，让我们看看其具体是如何使用的：  

```ts
world.addActor('sprite', Sein.SpriteActor, {
  width: 1, height: 1,
  texture: game.resource.get<'Texture'>('sprite.jpg'),
  position: new Sein.Vector3(-2, 0, 0)
});

const atlas = Sein.AtlasManager.CREATE_FROM_TEXTURE(game.resource.get<'Texture'>('sprite.jpg'), {
  cellWidth: 500,
  cellHeight: 500,
  framesPerLine: 1
});
world.addActor('sprite2', Sein.SpriteActor, {
  width: 1, height: 1,
  atlas,
  frameName: '0',
  position: new Sein.Vector3(2, 0, 0)
});

world.addActor('22', Sein.SpriteActor, {
  width: 1.8, height: 2,
  atlas: game.resource.get<'Atlas'>('22.json'),
  frameName: '01',
  position: new Sein.Vector3(0, 0, 0),
  materialOptions: {transparent: true},
  isBillboard: true
});
```

这里面我们用不同的参数初始化了三个2D精灵。每个精灵都指定了各自的宽度和长度。第一个精灵直接使用一个纹理`texture`来进行初始化，所以其UV完全映射到了整个纹理上，看到的也是完整的图像；第二个精灵在第一个基础上创建了一个`atlas`，之后指定纹理的一个区域绘制，一般用于完全自行控制的图集（雪碧图）；第三个精灵则完全不同，其使用了图集管理器`AtlasManager`（详见[图集](../render/atlas)），指定其中的一帧作为绘制来源，同时还使用`isBillboard`参数指定其为公告牌模式，使其始终朝向摄像机渲染。

## SpriteAnimation

2D精灵有一种特有的动画，称之为精灵动画[SpriteAnimation](../../document/classes/spriteanimation)，其本质上就是帧动画。对于帧动画，前端开发者一定非常熟悉了，Sein中将其封装，和SpriteComponent配合使用。  

以实例[2D精灵动画](../../example/animation/2d-sprite)为例，我们可以看到两种添加精灵动画的方式：  

### 纹理和索引

```ts
const atlas = Sein.AtlasManager.CREATE_FROM_TEXTURE(game.resource.get<'Texture'>('black-hole.png'), {
  cellWidth: 128,
  cellHeight: 128,
  framesPerLine: 7,
  frameStart: 0,
  frameCount: 47,
  spacing: 10
});
const blackHole = world.addActor('blackHole', Sein.SpriteActor, {
  atlas,
  width: .5,
  height: .5,
  frameName: '0',
  materialOptions: {
    transparent: true
  }
});
blackHole.transform.setPosition(0, .5, 0);
blackHole.addComponent('animator', Sein.AnimatorComponent);
blackHole.animator.register('hi', new Sein.SpriteAnimation({atlas, fps: 30}));
blackHole.animator.play('hi', Infinity);
```

关于精灵Actor本身的初始化和`animator`的注册播放前面已经说过，不再赘述，这里需要关注的是`Sein.SpriteAnimation`的创建，为了使用`SpriteAnimation`，我们必须先创建一个图集，其通过`Sein.AtlasManager.CREATE_FROM_TEXTURE`进行创建，创建传入了六个参数来控制图集。其中`frameStart`和`frameCount`是可选的，用于指定动画的帧数范围，这里指定从第0帧开始，总共47帧；`framesPerLine`指定了纹理中每一行有多少帧，每一帧的长宽均有精灵实例的`cellWidth`和``cellHeight`属性指定；`spacing`则决定了每一帧周围和其他帧的间距，注意横向和纵向间距必须为一个值。

生成图集后，就可以正式注册动画了，课件我们对动画的注册很简单，传入`atlas`和`fps`(决定绘制帧率)即可。之后还可以通过`componentName`参数来告知动画类具体的`SpriteComponent`组件名称，其默认为根组件`root`。如果只是要播放图集中一部分的序列，还可以使用`frameNames`参数，其实一个列表，对于我们上面这种方式创建的图集，每一帧的名字就是`['0', '1'...]`。

如果精灵动画完全和精灵自身有关系，同时`Sprite`也是通过`atlas`初始化的，那么这个`atlas`都不用传。

### AtlasManager

除了上述方式，还可以直接通过外部加载的图集来实现精灵动画：

```ts
const three = world.addActor('33', Sein.SpriteActor, {
  width: .66, height: .9,
  atlas: game.resource.get<'Atlas'>('33.json'),
  frameName: '01',
  materialOptions: {transparent: true}
});
three.transform.setPosition(1, 0, 0);
three.addComponent('animator', Sein.AnimatorComponent);
three.animator.register('hi', new Sein.SpriteAnimation({
  frameNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
  fps: 10
}));
three.animator.play('hi', Infinity);
```

这里我们用`atlas`方式初始化生成了精灵，所以下面注册动画的时候它默认就会去取这个精灵自身的图集管理器，当然也可以自行通过`atlas`参数传入一个全新的图集管理器。使用图集来做帧动画相对而言就十分简单了，直接传入`frameNames`参数指定要播放的帧序列、之后再设定帧率`fps`即可。
