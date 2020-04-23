# 基于React的HUD

现代前端很少再直接裸写DOM了，我们有了很多视图框架、它们带来了更好的选择。个人偏好于React，其灵活强大，比较适合做HUD的进一层封装，所以基于DomHUD进一步封装了ReactHUD，想使用它初始化可能复杂一些，但是功能也强大很多，除了DomHUD的基础功能，其还提供了一个`Container`和`Consumer`封装了**react new context api**，来用于传递`game`和`hudActor`的引用，以此完成高级事件传递等功能吗，这使得ReactHUD也可以用于做**GUI**。  

要使用它，首先安装：  

```shell
npm i seinjs-react-hud --save
```

详细的代码以及实例可以直接在这里观看：[基于React的HUD](../../example/hud/react-hud)。

`sein-react-hud`还有很多功能，详细的API文档可见[ReactHUD](https://github.com/hiloteam/seinjs-react-hud/blob/master/doc/README.md)。  
