# 基于DOM的HUD

HUD即平视显示器，在游戏中最严谨的定义就是那些永远盖在屏幕顶层、不会被3D物体遮挡的物体，比如人物头顶的对话框等。一般来说传统游戏引擎中HUD一般都是直接绘制到屏幕空间，要自行处理点击等事件，十分麻烦。  

但我们是在Web上开发，Web的DOM实际上就可以看做一种非常好用的HUD。借助于DOM，我们只需要再添加些许逻辑（比如和一个Actor的位置绑定），便可以很好的实现我们想要的功能。

对于Web，Sein提供了一个基于DOM的HUD系统，其依托于一个Component和一个Actor。你可以直接将HUDComponent添加到一个任意的SceneActor中来让其和根组件绑定，也可以创建一个HUDActor让其和世界中的另一个Actor进行绑定。要使用它，首先安装：  

```shell
npm i seinjs-dom-hud --save
```

之后直接引入使用：

```ts
import 'seinjs-dom-hud';

......
const hud1 = world.addActor('Sphere0', Sein.DomHUD.Actor, {
  dom: createDom('sphere0', '#f00')
});
// 连接到名为`Sphere`的Actor上，并设定相对偏移为{x: 0, y: -20}。
hud1.linkToActor(Sein.findActorByName(world, 'Sphere'), 0, -20);
hud1.event.add('PickStart', args => console.log('sphere0', args));

// 添加HUDComponent到`Sphere`上，让其自动连接到根组件上并设定Y偏移。
const hud2 = Sein.findActorByName(world, 'Sphere2').addComponent('hud', Sein.DomHUD.Component, {
  dom: createDom('sphere2', '#00f'),
  autoLink: true,
  autoLinkY: -40
});
hud2.event.add('PickStart', args => console.log('sphere2', args));
```

具体的实例效果可见[基于DOM的HUD](../../example/hud/dom-hud)。  

`sein-dom-hud`还有很多功能，详细的API文档可见[DomHUD](https://github.com/hiloteam/seinjs-dom-hud/blob/master/doc/README.md)。  
