# 基于GPU的粒子系统

Sein提供了一个扩展来实现基于GPU的粒子系统，其拥有一个`Component`和作为默认包装的`Actor`，来帮助开发者快速产生一些粒子效果。

## 使用

要使用它，首先安装：  

```shell
npm i seinjs-gpu-particle-system --save
```

之后直接引入使用：  

```ts
import 'seinjs-gpu-particle-system';

......
const particleSystem = world.addActor('particleSystem', Sein.GPUParticleSystem.Actor, {
  emitter: new Sein.GPUParticleSystem.EdgeEmitter({
    point1: new Sein.Vector3(0, 0, 0),
    point2: new Sein.Vector3(4, 4, 4)
  }),
  count: 1000,
  maxLifeTime: 4,
  minLifeTime: 2,
  updateSpeed: .01,
  maxVelocity: 1,
  minVelocity: .5,
  texture: game.resource.get<'Texture'>('point'),
  maxSize: 20,
  minSize: 10,
  maxAcceleration: 0
});
```

## 设计

GPU粒子系统主要通过生成由大量的`point`图元构成的`Goemetry`工作，所以所有粒子都是2D的并且是正方形的。其本质上拥有一个“双缓冲”，来保证持续不断的粒子发射，并且保证了在实际运行中没一帧只会更新一个时间Uniform`u_time`，保证开销可控。

参数方面，粒子系统提供了丰富的参数，包括纹理和图集、更新速度、粒子数量、出生位置和旋转、出生死亡颜色等基础的设置，还有速度、加速度、世界加速度、旋转速度等物理参数，足以达到各种各样的效果。  

控制方面，粒子系统提供标准的开始`start`、停止`stop`、暂停`pause`以及唤醒`resume`，保证控制的灵活性。  

与此同时，粒子系统提供了发射器`emitter`和轨迹参数`trajectoryShader`，允许你通过`shader`来自定义粒子的发射状态和轨迹，同时还提供了几种默认的发射器。

## 实例

我们提供了丰富的实例来展示粒子系统的效果——[边界发射器](../../example/gpu-particle-system/edge-emitter)、[风场发射器](../../example/gpu-particle-system/wind-emitter)、[球体发射器](../../example/gpu-particle-system/sphere-emitter)、[半球发射器](../../example/gpu-particle-system/hemispheric-emitter)、[自定义轨迹](../../example/gpu-particle-system/custom-trajectory)和[图集](../../example/gpu-particle-system/custom-trajectory)。

更详细的API文档可见[GPUParticlesSystem](https://github.com/hiloteam/seinjs-gpu-particles-system/blob/master/doc/README.md)。  

## 优化注意

使用粒子系统有一些规范，遵循这些规范有助于**大幅提升**性能：  

1. 减少不必要的范围区间，比如`maxRotation`和`minRotation`，如果你认为二者很相似，请直接让它们相等，粒子系统会在生成Shader的时候进行识别，对于上下界相等的区间范围会直接不进行计算，还会少一个Uniform的开销！
2. 在启动粒子系统后，尽量不要修改参数！虽然其提供了`setOption`方法来修改参数，但这回导致Shader重新生成编译，特别是在修改了`count`属性后，连Geometry都会重新生成，这是一个不小的开销！
