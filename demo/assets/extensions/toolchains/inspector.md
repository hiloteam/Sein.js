# Inspector

`seinjs-inspector`组件能够让你方便得引入一个inspector用于对整个游戏场景进行信息概览、检视等等，详见以下视频：

<video style="width: 100%; max-width: 1280px;" src="/assets/extensions/toolchains/inspector/0.mp4" controls></video>

## 使用

你有两种方式来引入Inspector——**代码引入**或者使用**Chrome扩展**：

### 代码引入

首先，你可以直接在代码中引入，先安装：

```sh
npm i seinjs-inspector --save-dev
```

>可以用`https://gw.alipayobjects.com/os/lib/seinjs-inspector/0.9.2/lib/index.js`引入，设置external。

然后引入：

```ts
import 'seinjs-inspector';

const inspector = game.addActor('inspector', Sein.Inspector.Actor, {
  /**
   * 指定渲染容器，不指定渲染到body下
   */
  dom: document.body,
  /**
   * 更新频率
   */
  updateRate: 10
});

// 手动同步一下顶点信息
inspector.syncVerticesInfo();
```

即可。

### Chrome扩展

>扩展商店审核中。

目前想要使用chrome扩展，你可以在这里下载：[seinjs-inspector.zip](/assets/extensions/toolchains/seinjs-inspector.zip)并解压，然后在Chrome扩展管理页面选择“加载已解压的扩展程序”，然后选择解压后的目录即可。

## 自定义检视属性

你也可以为自己编写的Actor、Component等内的属性添加被检视的能力，使用`Sein.inspectable`装饰器即可：

```ts
import * as Sein from 'seinjs';

export default class GameState extends Sein.StateActor {
  @Sein.inspectable()
  public test1: number;
  @Sein.inspectable('number-array')
  public test2: number[];
  @Sein.inspectable('number-array')
  public test2: number[];
  @Sein.inspectable('array', {onClick: (value: string) => {
    alert(value);
  }})
  public test2: string[];
}
```

可见，此装饰器有两个参数，前者是`type`，可以用于指定数值类型，若不指定则会自动推断，后一个是针对某些类型的`controller`可接受的参数，比如`array`类型就可以接受`onClick`用于在点击元素时响应事件。

目前内置的数值类型有：

1. basic: number、string、boolean
2. vector: Vector2、Vector3、Vector4、Euler、Quaternion
3. color: Color
4. layers: Layers
5. event: Event
6. shadow: Shadow
7. number-array: Array of number
8. list-action: List, options - `{getIsCurrent: (object: any, value: string | number) => boolean, onSwitch: (object: any, value: string | number, selected: boolean) => void}`
9. material: Material
10. texture: Texture
11. object: pure Object, options - `{properties: string[]}`
12. geometry: Geometry, options - `{attributes?: string[], materialName?: string}`
13. geometry-data: GeometryData
14. atlas: Atlas, options - `{getFrame: (object: Sein.SObject) => string,setFrame: (object: Sein.SObject, frame: string) => void}`
15. array: Array, options - `{onClick?: (value: any) => void}`
16. select: Select, options - `{options: TSelectValue[]}`,
17. image: Image
18. nest: Nested object like `interface TNestValue {name: string, value: TNestValue}`

## 更多功能

Inspector还提供了了更高阶的功能，你可以自定义**Panel**、针对某类数据的`controller`，针对某些对象的`editor`等等。后续会补完文档。
