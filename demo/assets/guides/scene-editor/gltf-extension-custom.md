# 自定义GlTF扩展

通过自定义GlTF扩展，开发者可以掌控自己想序列化到GlTF中的Unity中的资源，还可以控制如何将其反序列化到Unity中，以及如何在Sein中使用这个扩展。

你可以在这里获取自定义扩展的示例工程：https://github.com/dtysky/custom-gltf-extension-demo

一般来讲，自定义一个扩展，需要以下几个步骤：

## 定制Unity组件

打开你的Unity工程，可以新建一个文件夹专门用于存放扩展相关脚本，比如在此示例中是**Extensions**，然后新建第一个脚本`SeinTest`，继承自`MonoBehaviour`：

```c#
using UnityEngine;

[AddComponentMenu("Sein/Extensions/Sein Test")]
public class SeinTest : MonoBehaviour
{
    public float rotateSpeed;
}
```

这个脚本可以作为组件绑定到Unity的GameObject上进行配置，这里可配置的是`rotateSpeed`属性。

## 编写Extension

然后来编写扩展类`Sein_testExtension`，继承自`GLTF.Scheme.Extension` 其定义了我们如何存储`SeinTest`对应的GlTF扩展，以及如何进行序列化：

>注意一定要在`SeinJS`的命名空间下！

```C#
using GLTF.Schema;
using Newtonsoft.Json.Linq;

namespace SeinJS
{
    public class Sein_testExtension : Extension
    {
        public float rotateSpeed;

        public JProperty Serialize()
        {
            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_testExtensionFactory)), new JObject(
                new JProperty("rotateSpeed", rotateSpeed)
            ));
        }
    }
}
```

## 编写ExtensionFactory

之后我们还需要定义一个`Sein_testExtensionFactory`，指定需要注册的扩展名字、需要绑定的组件，以及如何从`SeinTest`组件转换到扩展，还有如何在导入的时候绑回去：

```c#
using System.Collections.Generic;
using UnityEngine;
using System;
using Newtonsoft.Json.Linq;
using GLTF.Schema;

namespace SeinJS
{
    public class Sein_testExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_test"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinTest) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            var extension = new Sein_testExtension();
            var test = component as SeinTest;

            extension.rotateSpeed = test.rotateSpeed;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_testExtension();

            if (extensionToken != null)
            {
                extension.rotateSpeed = (float)extensionToken.Value["rotateSpeed"];
            }

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var test = (Sein_testExtension)extension;
            var testComponent = gameObject.AddComponent<SeinTest>();
            testComponent.rotateSpeed = test.rotateSpeed;
        }
    }
}
```

## 在Sein中解析

以上都完成后，让我们将`SeinTest`绑到一个GameObject上，再导出，然后便可以看到确实被导出了：

```json
{
  ......
  "name": "bird",
  "extensions": {
    ......
    "Sein_test": {
      "rotateSpeed": 4.0
    }
  }
},
```

最后为了使用这个GlTF，我们还要在编写Sein.js的组件和扩展来解析它：

### 组件

一个简单的组件，用于根据配置的`rotateSpeed`来旋转父级模型：

```ts
import * as Sein from 'seinjs';

export interface ITestComponentState {
  rotateSpeed: number;
}

export function isTestComponent(value: Sein.SObject): value is TestComponent {
  return (value as TestComponent).isTestComponent;
}

@Sein.SClass({className: 'TestComponent'})
export default class TestComponent extends Sein.Component<ITestComponentState> {
  public isTestComponent = true;

  private rotateSpeed: number = 0;

  public onAdd(initState: ITestComponentState) {
    this.rotateSpeed = initState.rotateSpeed;
  }

  public onUpdate(delta: number) {
    this.getOwner<Sein.SceneActor>().transform.rotationY += delta / 1000 * this.rotateSpeed;
  }
}
```

### 扩展

之后定义并注册扩展，扩展的接口如下：

```ts

/**
 * GlTF扩展的接口类型。
 * 
 * @member name 扩展的名字，比如`Sein_node`。
 * @member init 文件初始化时，遇到该扩展或执行的方法。
 * @member parse 文件解析时，遇到该扩展时将会执行的方法。如果没有将有默认逻辑，将该扩展的属性保存下来，直接传递给在`instantiate`中的`info`。
 * @member instantiate 某个节点实例化结束后，遇到该扩展时将会执行的方法。
 */
export interface IGlTFExtension<IExtensionInfo = any> {
  name: string;
  init?(loader: {game: Game}, parser: GlTFParser): any;
  parse?(info: IExtensionInfo, parser: GlTFParser, result: any, options?: any): any;
  instantiate?(entity: SceneActor | SceneComponent, info: IExtensionInfo, game: Game, node: INodeWithGlTFExtensions, resource: IGlTFModel): void;
}
```

我们要定义的扩展：

```ts
import * as Sein from 'seinjs';

import TestComponent from './TestComponent';

interface ISeinTestExtensionInfo {
  rotateSpeed: number;
}

const SeinTestExtension: Sein.IGlTFExtension<ISeinTestExtensionInfo> = {
  name: 'Sein_test',
  instantiate(entity: Sein.SceneActor | Sein.SceneComponent, info: ISeinTestExtensionInfo, game: Sein.Game) {
    if (!Sein.isSceneActor(entity)) {
      Sein.Debug.warn(`You could not add physicBody to a component: ${entity.name}, ignore...`);
      return;
    }

    entity.addComponent('test', TestComponent, info);
  }
}

Sein.GlTFLoader.REGISTER_EXTENSION(SeinTestExtension);
```

然后就大功告成啦！
