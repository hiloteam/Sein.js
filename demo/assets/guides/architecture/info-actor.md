## InfoActor

`SceneActor`是唯一一类可以被放入`World`中的Actor，那么在此之外，还有一类不能被放入`World`但确实唯一可以被放入`Game`中的Actor，它们就是`InfoActor`了，所有要放入`Game`中的Actor都必须继承自InfoActor。  

这一类Actor你可以简单认为他们就是单纯的书记官，没有3D变换而仅仅是承载游戏逻辑，同时存储它们的父级容器也是`Game`而非`World`。在整个游戏逻辑中，InfoActor主要承担的是“状态管理”、“脚本逻辑”等等功能，你可以认为这类Actor就是游戏世界“规则”的体现。

一般来讲，InfoActor的**根组件**都是原生`Component`，所以其逻辑实际上基本都是写在自身内的，所以这类`Actor`一般而言不需要任何附加的`Component`（当然想要也可以，在一些特殊情况下会有）。

由于InfoActor的特殊性，所以有几类派生自它的Actor：

### StateActor

InfoActor最重要的派生类之一是`StateActor`，其用于管理特定状态信息，比如游戏全局状态、世界状态、关卡状态和玩家状态等等。理论上任何状态管理Actor都应该继承自StateActor。更多详细内容将在后续的“玩法逻辑”和“玩家系统”章节论述。

### GameModeActor和LevelScriptActor

InfoActor的另外两个重要派生类就是`GameModeActor`和`LevelScriptActor`，这两个在前面的章节已经有很多论述了，它们是脚本Actor，分别用于挂载在世界和关卡下，承载着这二者的玩法和展示逻辑，更多详细内容将在后续的“玩法逻辑”章节论述。

### SystemActor

InfoActor最后一个重要的派生类则是`SystemActor`，其代表着全局系统管理类，可以用于管理类似于物理系统、声音系统这种全局系统（比如一个总体的声音管理器和分散的音源、监听器构成一个系统），属于游戏系统规则一种体现。

### 更新优先级

同时相比于一般的Actor，其多出了一个字段`updatePriority`，用于标识更新优先级，并有默认的几个优先级可以在`InfoActor.UPDATE_PRIORITY`查看，以下几种派生类默认有自己的优先级，其他的则默认为`Others = -1`（插入时直接插入到最后）。

注意这是一个只读属性，在更新时，这些Actor将会更具各自的优先级先后更新，但注意，优先级只能在类继承时覆盖指定，运行时不可更改！
