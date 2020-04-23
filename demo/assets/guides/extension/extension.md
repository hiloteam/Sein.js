# 如何编写扩展

得益于Sein的强扩展性，开发者可以很方便得编写各种扩展来工未来或者他人使用。

## 输出

对于扩展的探讨一般始于编写，但我们反其道而行之，先讨论一下扩展编写的规范性问题。  

在前面的章节中我们提到了`CameraControls`扩展，在使用时是这样的：  

```ts
import 'seinjs';
import 'seinjs-camera-controls';

......
cameraActor.addComponent('control', Sein.CameraControls.CameraFreeController, ......);
```

可见和一般引入JS类库不同，我们直接`import`了这个库，就直接在`Sein.xxx`下使用它。这看起来很神奇，但在编程领域其实并没有什么真正魔法的事情，要做到这个效果主要需要两部分注意——js逻辑部分和ts类型部分。  

### 逻辑部分

逻辑部分其实很简单，比如你编写了一个组件`NiubilityComponent`和其包装容器`NiubilityActor`，准备以名字`seinjs-niubility`发布到npm，并想让开发者如此使用：  

```ts
import 'seinjs';
import 'seinjs-niubility';

......
actor.addComponent('control', Sein.Niubility.Component, ......);
```

这意味着你要有自己的Namespace`Niubility`，下面还要有你的两个类`Actor`和`Component`，假设这两相对于入口文件`index.ts`的路径是`./Component.ts`和`./Actor.ts`，那么直接在`index.ts`里写：  

```ts
import * as Sein from `seinjs`;
import NiubilityComponent, {IComponentState as INiubilityComponentState} from './Component';
import NiubilityActor from './Actor';

(Sein as any).Niubility = {
  Component: NiubilityComponent,
  Actor: NiubilityActor
};
```

即可。

### 类型部分

上面的代码中可能你会疑惑为什么不直接`import Actor from './Actor';`这样然后直接使用，这是出于类型系统的考虑，由于TS的限制，虽然直接扩展`seinjs`这个模块即可，但还是要有一定的写法：  

```ts
declare module 'seinjs' {
  export namespace Niubility {
    export {
      INiubilityComponentState as IComponentState,
      NiubilityComponent as Component,
      NiubilityActor as Actor,
    };
  }
}
```

### 通常导出

当然你也可以再提供一种通常的模块化导出方式让开发者自行使用：  

```ts
// index.ts文件末尾
export {
  INiubilityComponentState as IComponentState,
  NiubilityComponent as Component,
  NiubilityActor as Actor,
};
```

### 实例

你可以在这里查看其中的例子——[DomHUD](https://github.com/hiloteam/seinjs-dom-hud/blob/master/doc/README.md)，也可以仿照整个目录结构来编写扩展（注意，在这个实例中类型导出使用了`extends`，这是为了文档生成的考虑，可以忽略）。

## 编写

编写就很简单了，根据你想编写的类型，比如`Actor`、`Component`、`ResourceLoader`、`EventTrigger`等，根据对应章节的描述和规范编写即可。
