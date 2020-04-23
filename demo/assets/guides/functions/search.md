# 归类和搜索

世界内的物体越来越多，就需要我们有方法对这些物体做出归类，有了秩序，才好做查找。

## Actor归类

Sein提供了许多种方法给开发者，用于给Actor归类：

### 名字

名字对应的字段是`actor.name`，在使用`game.addActor`或者`world.addActor`添加的时候强制要求制定的第一个参数就是它。名字对于Actor而言不是唯一的，Sein允许多个重名的Actor存在。

### 标签

标签对应的字段是`actor.tag`，这个要求在创建了actor后进行手动的设置，也可以在自定义类中对其进行直接的设置。标签一般用于真正区分Actor的种类，比如“敌人”、“金币”等等。

### 类

类即为被创建的actor的类，这个在使用`game.addActor`或者`world.addActor`时的第二个参数指定，要注意如果要使一个类可以被搜索，必须使用`SClass`装饰器显式指定其`className`！正常指定的类的实例可以用`actor.className`找到其类名。

### 图层

图层也是一中分类，不过其有特殊之处，第一是其仅仅控制渲染，这一点可以在[摄像机](../basic-components/camera)章节找到，其二是暂时不能对齐进行搜索。

## Actor搜索

而与归类对应，也有许多种搜索方法，所有的这些方法都是基于`findActorByFilter`和`findActorsByFilter`方法，其即为基于过滤器的搜索，其他所有搜索不过是这种搜索的一个特例，所以先了解它有助于我们接下来的解释，这里同时也会说明一些搜索的优化方法。

### 过滤器

`findActorByFilter<TActor>`方法用于用过指定过滤器函数搜索特定的Actor，其类型是`(parent: TSceneActorParent, filter: (actor: SceneActor) => boolean) => TActor`，其中`TActor`是一个指定返回对象类型的泛型参数。这个方法有两个参数，`parent`用于指定要搜索的容器，这个容器可以使`Game`实例、`World`实例或者`SceneActor`实例，如果是`SceneActor`实例，则会使用广度优先搜索搜索其所有子级Actor，但一般不常用；另一个参数是过滤器函数，其入参是当前搜索到的actor，出参是一个布尔值，若为`true`则将此actor作为搜索到的结果并立即返回，否则继续搜索下一个。

`findActorsByFilter<TActor>`方法，相较于上一个方法多出了个`s`，其类型为`(parent: TSceneActorParent, filter: (actor: SceneActor) => boolean, stopFinding?: (actor: SceneActor, actors?: TActor[]) => boolean) => TActor[]`，从返回值就可以看出，其搜索到的是所有符合过滤器条件的数组。在搜索过程中，如果没有第三个参数`stopFinding`，那么此方法必然会遍历所有的actor，而如果指定了`stopFinding`方法，则可以精确控制到哪一步结束搜索（返回`boolean`即可），这一点可以通过其参数当前搜索到的`actor`和已经满足条件的数组`actors`决定。

下面大多搜索都只是将过滤器函数`filter`换成了其他预设的条件。

### 名字

使用`Sein.findActorByName`或者`Sein.findActorsByName`可以使用名字对特定容器中的Actor进行搜索：

```ts
Sein.findActorByName<HeroActor>(world, 'hero');

// 找到两个就立即返回
Sein.findActorsByName<HeroActor>(world, 'hero', (hero, heros) => heros.length > 1);
```

### 标签

使用`Sein.findActorByTag`或者`Sein.findActorsByTag`可以使用标签对特定容器中的Actor进行搜索。

```ts
Sein.findActorByName<EnemyActor>(world, 'enemy');

// 找到两个就立即返回
Sein.findActorsByName<EnemyActor>(world, 'hero', (enemy, enemies) => enemies.length > 1);
```

### 类

使用`Sein.findActorByClass`或者`Sein.findActorsByClass`可以使用类对特定容器中的Actor进行搜索。

```ts
Sein.findActorByClass<FlowerActor>(world, FlowerActor);

// 找到两个就立即返回
Sein.findActorsByClass<FlowerActor>(world, FlowerActor, (flower, Flowers) => flowers.length > 1);
```

### 类名

使用`Sein.findActorByClassName`或者`Sein.findActorsByClassName`可以使用类对特定容器中的Actor进行搜索。

```ts
Sein.findActorByClassName<FlowerActor>(world, 'FlowerActor');

// 找到两个就立即返回
Sein.findActorsByClassName<FlowerActor>(world, 'FlowerActor', (flower, Flowers) => flowers.length > 1);
```

### 名字路径

名字路径，不同于名字，是一种比较特殊的存在。它仅仅存在于一个拥有子级Actor的SceneActor中，而由于Sein不推荐Actor的级联，所有这个方法也不怎么用得到。简单来说，`findActorByNamePath`方法允许你指定一个父级SceneActor以及一个名字路径数组`namePath`，通过广度优先搜索来搜索符合条件的第一个actor：

```ts
Sein.findActorByNamePath<FingerActor>(human, ['body', 'arm', 'hand', 'finger']);
```

### UUID

UUID也是一种不常用的搜索方法，由于所有的Actor拥有自身唯一的UUID，在知道UUID的情况下你可以直接搜索到唯一的Actor，当然在这种情况下，我们还不如直接保留它的引用：  

```ts
Sein.findActorByUUID<CloudActor>(world, 233);
```

## Component搜索

Actor可以被搜索，Component自然也可以。实际上Component在Actor内是以[SMap<Component>](../../document/classes/smap)的方式存在的，所以实际上Component的搜索也就代理到了`SMap`的搜索。一般而言，我们有下面几种方式来搜索Component：

### 名字

最常用的便是通过名字来搜索，由于组件具备名字的唯一性，这种方式的执行效率也是最高的：

```ts
actor.findComponentByName<Sein.AnimatorComponent>('animator');
```

### 类

也可以通过Component的类来进行搜索，由于是否可以注册多个同样的Component是交由其自身实现来控制的，所以这里也提供了查找实例化自某类的所有Component的方法：  

```ts
actor.findComponentByName<Sein.AnimatorComponent>(Sein.AnimatorComponent);

// 查找所有
actor.findComponentsByName<Sein.AnimatorComponent>(Sein.AnimatorComponent);
```
