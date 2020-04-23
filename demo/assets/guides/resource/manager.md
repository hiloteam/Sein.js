# 资源管理器

资源管理，是多数游戏引擎最复杂的一部分。对于Sein这个Web游戏引擎而言，虽然没有那么复杂，但也有相当的内容。

和“事件系统”一样，资源管理也分为两部分——作为综合管理的“资源管理器”以及可以通过“注册”和“反注册”拆卸的“资源加载器”。资源加载器将在下一节详细统一论述，这里先讲解资源管理器的功能。  

资源管理器类是[ResourceManager](../../document/classes/resourcemanager)，一般而言，开发者不回去自己创建它，而是直接使用游戏实例下的管理器实例`game.resource`，这个实例是整个游戏作用域的资源管理器，承担着整个游戏生命周期的所有资源的管理，一般开发者使用下面的几个方法来进行管理：  

## 加载

`resource.load`方法被用于资源加载，其一般配合`LevelScriptActor`的`onPreload`和`onLoading`生命周期一起使用，但若有特殊场合，也可以自行在任何一个地方使用。  

这个方法接受一个继承自[IResourceEntity](../../document/interfaces/iresourceentity)接口的参数，具体参数类型根据要加载的资源类型而有所不同，但究其基本，最核心的有三个参数：  

```ts
game.resource.load({type: 'GlTF', name: 'building.gltf', url: '/assets/models/building/task_building_6.gltf'});
```

在这段加载代码中，`type`表示资源的类型，`name`表示资源的名字，这个名字是全局唯一的，`url`则表示资源的线上地址。一般情况下这三个参数已经足够加载一个资源，但根据实际情况，也可以传入`weight`属性来表示当前资源的权重，这个在做精确资源预加载的时候很有效。除此之外，根据资源加载器自己的规定，可能还会有更多字段被索取或者可以被选择，比如对于`ImageLoader`就可以配置是否允许跨域的flag`crossOrigin`。  

加载方法返回的是一个`Promise`，这意味着你可以自己在任何时候执行加载方法，并在单个加载结束时执行你想要的逻辑：  

```ts
async function load(game: Sein.Game) {
  const result = await game.load({......});
  // 你的逻辑
  ......
}
```

## 获取

加载了资源后我们便想使用它，对于绝大多数资源，直接调用`get<T>(name: string)`方法获取到资源加载结果便可以直接使用了，比如将加载好的纹理赋给材质的一个`uniform`：  

```ts
material.getUniform<Sein.Texture>('u_diffuseMap').value = resource.get<Sein.Texture>('diffuse.jpg');
```

而对于一些特殊的资源，比如`GlTF`，就需要特殊的方法来使用，这种方法称为**实例化**。

## 实例化

实例化`resource.instantiate`是一个特殊的方法，其接受一个名字和一个参数，返回一个特定的实例化结果。我们知道类的实例化是以类为原型生成一个对象，那么何为资源的实例化？其实就是以资源为原型生成一个特殊的结果，生成的结果根据资源的类型有所不同，完全依赖于各个加载器自身的实现。  

在Sein中，目前只有`GlTF`类型的资源实现了这个方法，它以加载好的GlTF模型为原型，根据配置参数的不同，生成一个或多个Actor或Component，并返回一个Actor数组。这一点将在[GlTF模型](../scene-editor/gltf)一节中详细论述。

## 添加

有时候我们不仅仅希望从线上加载资源，还希望直接用代码直接生成资源，然后添加到资源管理器中供后续使用。比如创建一张生成的图片，由其创建纹理供后续的材质复用：  

```ts
// 假设离屏`canvas`实例已被绘制完毕
const texture = new Sein.Texture({image: canvas});
resource.add('Texture', 'myTex.tex', texture);

// 获取
resource.get<Texture>('myTex.tex');
```

## 释放

有生就有死。有时候我们在加载了一个资源并使用后，确认其使用完毕不想浪费内存，便可以对其进行释放：  

```ts
resource.release('building.gltf');
```

这段代码就实现了释放名为`building.gltf`的资源的功能。注意此方法会同时调用资源对应加载器的`release`方法，如此便可以实现资源的完全释放，所以**一定要保证资源在释放时已然没有引用，这个需要手动来保证！否则会有内存泄漏风险！**

## 取消加载

取消加载用于特定的场合，比如一个关卡中有一些异步加载的功能性资源，但知道关卡结束后还没有加载完成，我们需要在关卡切换时取消它的加载，这时候就可以使用`game.resource.cancel(name)`或者`game.resource.cancelAll()`来实现需求，详见实例[取消加载](../../example/resource/cancel)。
