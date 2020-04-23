# 摄像机和天空盒

摄像机的原理这里不再赘述，有兴趣的同学可以自己去翻阅相关资料。作为观察整个游戏世界的眼睛，摄像机的重要性毋庸置疑，在Sein中，你至少要添加一个摄像机到世界中才可以正确看到渲染内容。  

不同的摄像机基本都拥有一个Component、以及对其进行简单封装的容器Actor，你也可以直接使用容器Actor，也可以在自己的Actor中添加摄像机Component。

## 定义

### CameraComponent

所有的摄像机Component都应该继承自`CameraComponent`，并实现其中的一些特定方法。CameraComponent是一个基类，其本身包含了摄像机的一些通用功能，比如获取特定矩阵`viewMatrix`、`projectionMatrix`等，还比如方便的变换和反变换坐标方法`projectVector`、`unprojectVector`；并为一些需要特例化实现的方法提供了接口，比如生成射线`generateRay`。  

不仅如此，画面真正的渲染也是在摄像机组件内完成的，在每一帧逻辑更新后，世界通过调用当前主摄像机的`render`方法来完成渲染。这也就是说，现存于内核的图层`layers`和后续将要添加的后处理系统都是完全基于摄像机的。  

>注意，目前不建议自行去实现任何特例化的摄像机，若有需求请联系开发者。

### PerspectiveCameraComponent

`PerspectiveCameraComponent`即透视摄像机组件，是`CameraComponent`的一个派生。其提供了透视摄像机的功能，也是绝大部分游戏场合是用的摄像机。其初始化参数以及可以调节的属性定义在[IPerspectiveCameraComponentState](../../document/interfaces/iperspectivecameracomponentstate)中。

### PerspectiveCameraActor

`PerspectiveCameraActor`是`PerspectiveCameraComponent`的一个简单封装，对于简单场景你可以直接使用`world.addActor('camera', PerspectiveCameraActor, {...})`来为当前世界添加一个默认透视相机。

### OrthographicCameraComponent

`OrthographicCameraComponent`即正交摄像机组件，是`CameraComponent`的一个派生。其提供了正交摄像机的功能。其初始化参数以及可以调节的属性定义在[IOrthographicCameraComponentState](../../document/interfaces/iorthographiccameracomponentstate)中。

### OrthographicCameraActor

`OrthographicCameraActor`是`OrthographicCameraComponent`的一个简单封装，对于简单场景你可以直接使用`world.addActor('camera', OrthographicCameraActor, {...})`来为当前世界添加一个默认正交相机。

## 使用

在实际游戏编程中，一般用法是在世界的默认入口`LevelScriptActor`中创建`XXCameraActor`，然后将其标记为`persistent`，这样这个摄像机就可以在关卡切换时进行保留。  

当然，像前面的章节说到的需要让摄像机跟随某个实例（比如Hero）的状况也是可能存在的，这个时候我们可以将摄像机Component注册到Hero的`PlayerControllerActor`上，并开启Controller的跟随模式，这样相机就可以始终跟随Hero了。  

有时候我们也可能不止有一个摄像机，比如我可能会想快速进行多个视角的转换，而每个视角又有自己的变换逻辑。这时候就可以使用`world.setMainCamera`方法来切换当前的主相机，你可以通过CameraComponent的实例引用或者实现了接口`{camera: CameraComponent}`的实例引用来设置主相机，但`world`中主相机的引用始终是实际上的`CameraComponent`的。

>注意，目前分屏渲染的功能尚未实现，但有预留接口`world.cameras`，一般没有这个需求，有需求联系开发者。

关于透视摄像机和正交摄像机的实例，请见[透视摄像机](../../example/camera/perspective-camera)和[正交摄像机](../../example/camera/perspective-camera)。

## 天空盒

针对摄像机，你还可以为其绑定一个**天空盒（Skybox）**，通过指定初始化参数中的`backgroundMat`便可以实现：

```ts
world.addActor('camera', Sein.PerspectiveCameraActor, {
  aspect: game.screenAspect,
  fov: 60,
  near: 0.01,
  far: 100,
  position: new Sein.Vector3(0, 10, -20),
  backgroundMat: new Sein.SkyboxMaterial({
    type: 'Cube',
    uniforms: {
      u_color: {value: new Sein.Color(1, 1, 1)},
      u_texture: {value: game.resource.get<'CubeTexture'>('skybox.tex')}
    }
  })
});
```

注意此处用到了`SkyboxMaterial`，其为一个内置的Skybox材质，提供了立方体纹理`Cube`、全景纹理`Panoramic`和纯色`Color`三种模式，详细可以看文档：[SkyboxMaterial](../../document/classes/skyboxmaterial)。

实例请见[天空盒](../../example/camera/skybox)。

>当然，天空盒更多得一般是通过工作流在Unity中添加，可以看这里：[加上背景吧，使用天空盒！](../../tutorial/artist/skybox)。

## 截取画布

`CameraComponent`还提供了简单截取画布的功能，实例请见[截取画布](../../example/camera/capture-screen)。

>注意开销，截取画布会立即再渲染一遍场景！

## 控制器

为了方便入门用户更加简单地使用摄像机，Sein提供了几个控制器扩展，详细请见[摄像机控制器](../../extension/camera-controls)一章。
