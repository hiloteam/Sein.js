# 全局默认事件

对于整体引擎而言，Sein默认提供了一系列的全局事件，来暴露出必要的一些接口。这个全局事件对应的事件管理器即为`game.event`，在类型系统的监督，其本质上是这个`EventManager`的默认泛型参数（当然你也可以利用`game.getEvent<TEvents>`方法来指定泛型参数），用来帮助TS做类型推断，从而使得开发者可以更边界得使用特性。  

## 默认声明

默认声明见[IGlobalDefaultEvents](../../document/interfaces/iglobaldefaultevents)。

在实际编程中，你可以对这些接口进行扩展来修改全局默认声明。

## 追加事件声明

扩展方式如下：  

```ts
declare module 'seinjs/types/Global' {
  export interface IGlobalDefaultEvents {
    ShowFairies: {fairies: Fairy[]};
  }
}
```

这就追加了一个`ShowFairies`。
