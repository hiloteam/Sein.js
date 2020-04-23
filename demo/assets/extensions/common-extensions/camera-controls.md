# 摄像机控制器

摄像机控制器组件用于为摄像机组件添加适当的控制，这是一个很常用的通用逻辑，所以官方提供了一定程度的通用封装，已经足以面对绝大多数场景，但更加复杂和定制化的需求还需开发者自行开发，不过也可以参考官方实现。  

要使用控制器组件，先安装：  

```shell
npm i seinjs-camera-controls --save
```

之后便可以引入使用它们，详细的使用方法和实例可见[Actor观察控制器](../../example/camera/actor-observe-control)、[绕轨相机控制器](../../example/camera/camera-orbit-control)和[自由相机控制器](../../example/camera/free-orbit-control)。

更详细的API文档可见[CameraControls](https://github.com/hiloteam/seinjs-camera-controllers/blob/master/doc/README.md)。  

