# SceneComponent(Actor)

前面提到过一类特殊的`Actor`，它们是唯一一类可以被放入`World`中的`Actor`，即`SceneActor`，而其根组件，也必然是`SceneComponent`。

`SceneComponent`派生自原始`Component`，可以说无疑是最重要的一种派生类，你甚至可以将其当成另一种特殊的基础Component。相较于Component，其增加了各类`transform`属性，如`position`、`rotation`，简而言之就是多出了3D变换的能力，这也使得SceneComponent成为了可以并且唯一可以被放入游戏世界`World`中的Component（实际上是根组件为SceneComponent的Actor）。  

这意味着SceneComponent成为了世界中的唯一一种组件，任何需要放入世界中的组件都要继承自SceneComponent，比如静态模型类`StaticMeshComponent`、点光源类`PointLightComponent`等等。而其自身，也提供了许多种属性和方法来方便地让玩家进行物体的变换操作，比如位置`position`、旋转`rotation`、缩放`scale`、锚点`pivot`、四元数`quaternion`、本地矩阵`matrix`以及它们的单独分量像是`x`、`rotationX`、`scalex`等等，同时你还可以直接通过`worldMatrix`、`absolutePosition`、`ndcPosition`、`upVector`等等来获取想要的计算好的数据，可以通过`visible`来直接控制显示与否、`isStatic`可以用于为完全静态的模型做优化（将不会在每一帧实时计算世界矩阵），还有`lookAt`这种方法帮助你快速进行跟随设定。  

由于有了`transform`信息，就导致SceneComponent是唯一一种可以嵌套的Component。嵌套是可行的，在某些场合也是有用的，你在给一个`SceneActor`添加组件时可以在初始化参数后加上一个`parentComponent`参数来指定其父级。然而在绝大部分状况下，我们应当不使用嵌套，或是在完全明了了优化手段的情况下来组织嵌套！太深的组件树将会导致较大的性能开销，这点请务必记住！你可以使用SceneActor来更好地组织组件们。  

同时由于SceneComponent的特殊性，绝大多数其派生类都是没有逻辑的，所以从模型中加载的Mesh、Light、Camera等等的`needUpdateAndDestroy`都是`false`，也就是不进入更新和销毁队列。和这个相关的还有`needReleaseGlRes`属性，用于精确控制是否要在销毁时释放Gl资源，默认释放，但也允许开发者手动控制资源的复用和释放，对于从外部GlTF资源实例化的Component将会默认不释放，而在资源释放时统一释放Gl资源，达到性能和内存的平衡。

## SceneActor

有了`SceneComponent`，自然就会有`SceneActor`。SceneActor当然可以看做是SceneComponent的一个容器，只不过和一般的简单的容器关系不同，SceneActor有着更多的功能，这也是和其他所有内置的、作为容器的Actor不一样的地方。  

首先，SceneActor拥有着特别的生命周期`onInstantiate`，顾名思义，这个生命周期在Actor实例化后触发，那么何为实例化？很多时候我们的SceneActor并非代码创建，而是来自于模型数据，并且我们可以通过扩展为模型指定其实现的SceneActor（后续章节会讲到）。由于内部实现原因，在模型对应的SceneActor被添加到世界时，其实例化可能尚未结束（比如动画组件和刚体组件等为初始化），所以需要这么一个生命周期来确保开发者可以在一切就绪时进行逻辑操作。  

其次就是SceneActor拥有的特有属性，其提供了一些对根组件属性的代理，比如`visible`、`isStatic`等，也提供了一个`transform`属性用于快速语义化访问根级组件，对于动画组件`animator`和物理刚体组件`rigidBody`这样的常用组件，其也提供了直接的访问器来替代`findComponentByXX`这样的搜索方法。  

>一般来讲，我们认为一个`Actor`拥有了某个**根组件**，本质上就拥有了根组件对应的Actor功能，所以一个具有`PointLightComponent`的`Actor`可以被视为`PointLightActor`。但`SceneActor`不同，它和`InfoActor`（后面会讲到）一样，是一种特殊的基础`Actor`，所有放入`World`中的`Actor`都必须继承自`SceneActor`。

### 图层和可继承

`SceneActor`提供了两个特别的属性`layers`和`persistent`，单列一小节是为了表示其重要性。`layers`即图层，用于和Camera的`layers`配合，可以快速切换显示组；`persistent`即持久化，这个持久化是指在关卡间、或世界间的持久化，若为一个SceneActor指定了其`persistent`为`true`，则其将在关卡切换时被保留到下一个关卡，若想在世界切换时也保留，则需要在执行`switchWorld`传入最后一个`needInheritActors`参数来控制。

以上这一切使得SceneActor是所有可被放入`World`的Actor的基类，如果你想将一个自定义的Actor放入World，那么其一定要继承自SceneActor，并且根组件是SceneComponent、并且初始化参数类型接口继承自`ISceneComponent`。

### 子级Actor

对了，还有一点没说。如果你有使用过其他渲染/游戏引擎，那么一定很想知道一个问题——SceneActor可以级联吗？这个问题是合理的，因为无论是Unity的GameObject，还是Three的Object，看起来都和Actor是一种东西。这里的回答也很简单，首先，SceneActor和GameObject和Object之类的其实都并不是一种东西，虽然都拥有Transform，但SceneActor下可以挂载无数个SceneComponent（很多情况下是模型组件）；其次，所有的SceneActor其实都是**平铺**在世界中的，它们永远拥有自己的、不依赖于任何其他Actor的生命周期；最后，SceneActor当然也是可以级联的，但这仅仅表示一种**单纯的连接关系**，也就是Transform层面上的级联关系，当然，为了使开发者不迷惑，Sein也为这种情况作了一些优化。  

Sein实际上提供了一个`ChildActorComponent`组件来达到级联的目的，如下面的代码：  

```ts
aActor.addComponent('child', Sein.ChildActorComponent, {actor: bActor});
```

这段代码中，我们将`bActor`添加为了`aActor`子级，至此bActor的世界矩阵计算将依赖于aActor。当然，我们也可以通过更简单的方法来实现这个目的：  

```ts
aActor.addChild(bActor);
```

如果想要移除子级，那么有下面两种方法：  

```ts
aActor.removeComponent('child');

// or
aActor.removeChild(bActor);
```

>注意，为了使得这种特殊情况具备逻辑和直觉的一致性，如果你移除了`aActor`，那么`bActor`也会被一并移除！

当然，有些情况下我们还想在不销毁`bActor`的情况下动态变更其父级，Sein也提供了这个方案：  

```ts
bActor.changeParent(cActor);

// 或者直接回到World的顶层
bActor.changeParent(world);
```
