# 判断实例类型

很多时候我们需要判断一个实例的类型，这个在不同的语言有不同的做法。在JS中，最常见的做法就是使用`typeof`或者`instanceof`方法来判断一个实例的类型。

这些判断对于TS也是有效的，比如：

```ts
// 假定`A`拥有方法`a`，`B`拥有方法`b`
const test: A | B = 1;

if (test instanceof A) {
  test.a();
} else {
  test.b();
}
```

TS可以自动在分支中识别出类型。

但这种方法的效率其实相对比较低，对于Sein而言，我们提供了更加高效的方法来判断实例类型（稍微有一些限制）。

## 谓词

这里首先要提到“谓词”的概念，在语言学中，其表达一种“判定”，判定主体的性质。而在计算机科学中，其含义也基本一致。  

TS提供了“谓词”来让我们得以构造函数来判定一个实例的类型，其典型声明为：  

```ts
// 假设A有一个成员变量`isA`为`true`
function isA(value: A | B): value is A {
  return (value as A).isA;
}
```

然后在实际使用中，我们便可以这样来判定一个值的类型：

```ts
const test: A | B = 1;

if (isA(test)) {
  test.a();
} else {
  test.b();
}
```

## Sein的设计

可见使用谓词判断非常简洁并高效，因为其只是一个Bool类型的判断。但其有一些限制，就是要**确保自己明确实例之间的不同**，这需要开发者非常清楚地设计出一套不会矛盾的方案。

Sein使用了一种相对简单但有效的方案，不过需要开发者自己去做一些规避，如果你用`SeinJSVSCodeExtension`来新建一个类，会发现模板里已经帮你写好了：  

```ts
function isTestActor(value: SObject): value is TestActor {
  return (value as TestActor).isTestActor;
}

class TestActor extends Sein.InfoActor {
  public isTestActor = true;
}
```

一目了然无需赘述，这里唯一需要注意的就是不要把名字写重了。

## 使用

基于上面的设计，Sein提供了大量“谓词方法”用于判断实例类型：

```ts
Sein.isActor(test);
Sein.isSceneActor(test);
Sein.isGlTFLoader(test);
......
```
