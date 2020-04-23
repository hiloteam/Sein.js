# 逻辑脚本绑定

Unity扩展提供了将Unity中的GameObject和Sein中的类关联起来，并在实例化创建时自动绑定和初始化的能力。只需要下面简单的几步便可以实现这一能力（可能需要你写一点点C#，不过不要担心，很简单）。

## 编写Sein中的类

首先，我们需要编写一个Sein中的类，目前而言，它可以是一个SceneActor或SceneComponent，不过要注意**一定要和Unity中对象的类型相匹配**！比如你想给一个”带有Mesh“的对象指定脚本，就需要指定对应的`StaticMeshActor`或者`StaticMeshComponent`，带骨骼的Mesh则是`SkeletalMeshActor`/`SkeletalMeshComponent`，灯光等同理。

比如这里我要编写一个带Mesh的Actor：

```ts
interface ITestActorOptions {
  a: number;
  b: number;
  c: string;
  d: boolean;
  e: Sein.Texture;
  f: Sein.Vector2;
  g: Sein.Vector3;
  h: Sein.Vector4;
  i: Sein.Quaternion;
  j: Sein.Color;
  k: number[];
  l: Sein.Matrix4
  m: {
     x: number;
     y: number;
     z: Color;
  };
}

@Sein.SClass({className: 'TestActor'})
class TestActor extends Sein.StaticMeshActor {
  public onInit(initOptions: ITestActorOptions) {
    console.log('initOptions from gltf:', initOptions);
  }

  public onUpdate(delta: number) {
    this.transform.rotationY += 0.01;
  }
}
```

>不要忘了使用`@Sein.SClass`装饰器来指定类名！

## 编写C#头文件

接下来，让我们根据定义的类的类名，以及初始化参数接口`ITestActorOptions`，来在Unity中定义C#头文件吧：

```c#
using UnityEngine;
using UnityEditor;
using SeinJS;

[AddComponentMenu("Sein/Classes/Test Actor")]
public class SeinNodeClass_TestActor : SeinNodeClass
{
    [System.Serializable]
    public struct TestActorComplex
    {
        public int x;
        public float y;
        public Color z;
    }

    [System.Serializable]
    public struct TestActorOptions
    {
        public int a;
        public float b;
        public string c;
        public bool d;
        public Texture2D e;
        public Vector2 f;
        public Vector3 g;
        public Vector4 h;
        public Quaternion i;
        public Color j;
        public float[] k;
        public Matrix4x4 l;
        public TestActorComplex m;
    }

    public new TestActorOptions options;
}
```

这里有几个注意点:

1. 头文件的类名一定要和Sein中的类名对应，并且是`SeinNodeClass_XXXXX`这种形式的。
2. 头文件类中一定要存在`options`成员，并且定义方式一定是`public new XXXXX options`。

## 绑定

定义完了C#的头文件，就可以进行绑定啦，让我们随便找一个对象，先添加一个`SeinNode`组件，指定`SelfType`为`Actor`（因为我们定义的类是一个Actor），然后把你写的头文件（c#文件）拖上去即可，如果像上面使用了`[AddComponentMenu("Sein/Classes/Test Actor")]`进行注册，还可以直接点击`Add Component`，输入`Test Actor`这种进行搜索添加。

添加好的状况如图：

![](/assets/guides/assets/gltf-script-binding/1.png)

## 导出使用

之后便可以打开Exporter进行导出，导出后直接在Sein的`LevelScript`中加载使用即可：

```ts
export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'test.gltf', url: '/assets/models/script-binding/scene.gltf'});
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, -4), target: new Sein.Vector3(0, 0, 0)});
    createDefaultLights(game);

    game.resource.instantiate<'GlTF'>('test.gltf');
  }
}
```

具体的效果可见DEMO：[glTF脚本绑定](../../example/resource/gltf-script-binding)。

## 支持的数据类型和扩展

目前，Sein官方支持的数据类型都在上面的示例中展示了，大部分基础数据类型都支持了，还支持了Array和Object这种特殊的复合数据类型。

但在实际使用中，总有可能无法覆盖到所有的需求，所以我们预留了扩展方法，来让开发者扩展。扩展主要分为两部分：Unity端和Sein端的。

以一个`byte`类型的支持为例：

### Unity

```c#
using UnityEngine;
using UnityEditor;
using SeinJS;

// 上面的例子定义的那个类
[AddComponentMenu("Sein/Classes/Test Actor")]
public class SeinNodeClass_TestActor : SeinNodeClass
{
    ......
    public virtual SeinJS.SeinNodeOption SerializeValueUnknown(SeinJS.ExporterEntry entry, object option)
    {
        if (options is byte) {
          return return SerializeValue(entry, (byte)option);
        }

        return base.SerializeValueUnknown(entry, options);
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, byte option)
    {
        return new SeinJS.SeinNodeOption("Byte", option);
    }
}
```

### Sein

```ts
Sein.glTFLoader.GET_EXTENSION_HANDLER('Sein_node').registerOptionParsers('Byte', (value, parser, info) => value);
```

## 计划中要做的

1. 目前这种方式虽然很灵活强大了但仍然不完美，最完美的是省去手动编写C#头文件的环节，配置指定文件后，自动通过TS的interface定义自定编译出C#的头文件。
2. 是否要支持纯Component的绑定？通过类似的方式，指定Actor下面拥有哪些纯功能性Component，然后映射起来，但这个在目前Sein的架构中似乎不太常用，考虑中，
3. 反序列化的能力，也就是导入glTF文件时，从Sein_node的`className`和`initOptions`参数里反序列回Unity的头文件组件，这个目前不少强需求，待定。
