# 基于小程序的HUD

本扩展组件提供了基于小程序的HUD的能力，可以让你的小程序节点跟随3D场景中的物体运动。由于小程序特殊的单向数据驱动特性，所使用上和`DomHUD`等想去甚远，所以相比起来，需要改变一下思维方式。

## 例子

可以先打开Sein.js小程序官方示例中的**HUD->基础**来查看效果，示例请见[扩展容器-阿里小程序](../containers/my-tiny-program)。

## 安装

首先让我们安装：

```shell
npm i seinjs-tiny-program-hud --save
```

## 使用

使用主要分为两部分。

### 游戏代码

首先在你的游戏代码中（比如`MainLevelScript.onCreate`）添加HUD系统：

```ts
import 'seinjs-tiny-program-hud';

......

game.addActor('tiny-program-hud-system', Sein.TinyProgramHUD.SystemActor);
```

### 小程序代码

之后再小程序端，比如在一个页面中，使用我们的HUD组件，配置对应的组件：

```json
// index.json
{
  "component": true,
  "usingComponents":{
    "hud-container": "seinjs-tiny-program-hud/my-component/container/index",
    "hud-item": "seinjs-tiny-program-hud/my-component/item/index"
  }
}
```

之后使用：

```xml
// index.axml
<view>
<seinjs onSeinCanvasCreated="onSeinCanvasCreated" />
<hud-container a:if="{{inited === true}}">
  <hud-item
    onGetGame="onGetGame"
    onGetLinkedObject="onGetLinkedObject1"
  >
    <text class="hud" style="background:#f00;">Sphere</text>
  </hud-item>
  <hud-item
    onGetGame="onGetGame"
    onGetLinkedObject="onGetLinkedObject2"
  >
    <text class="hud" style="background:#00f;">Sphere2</text>
  </hud-item>
</hud-container>
</view>
```

```js
// index.js
Page({
  data: {
    inited: false
  },
  game: null,
  linedObj1: null,
  linedObj2: null,
  onSeinCanvasCreated(canvas) {
    this.game = await main(canvas);

    this.game.event.add('LevelDidCreateActors', () => {
      this.linedObj1 = my.Sein.findActorByName(this.game.world, 'Sphere');
      this.linedObj2 = my.Sein.findActorByName(this.game.world, 'Sphere2');
      this.setData({inited: true});
    });
  },
  onGetGame() {
    return this.game;
  },
  onGetLinkedObject1() {
    return this.linedObj1;
  },
  onGetLinkedObject2() {
    return this.linedObj2;
  }
});
```
