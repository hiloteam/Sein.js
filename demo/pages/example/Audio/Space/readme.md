@cn

展示了空间音频系统的使用，可以通过在`SourceComponent`初始化的时候开启并配置属性`spaceOptions`的方式来声明这个音频源是一个空间音频源。对于配置的详情可参照[PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)。  

除此之外，也可以通过修改`ListenerComponent`的`rotatable`属性来设定监听器是否要同步其在3D空间中节点的旋转，默认为关。  

在此实例中，你可以通过使用键盘的`WSAD`四个键来控制监听器（红点）移动，来通过听觉观察其在两个音频源的范围不同位置时的变化。

@en

hahahaha
