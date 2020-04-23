# 几何体

一个存在于渲染引擎中的3D物体，我们一般称之为Model(模型)，或者曲面Mesh(曲面)。一个Mesh，一般有两部分构成——存储其顶点属性的“几何体”、以及描述其渲染方式的“材质”。

## 几何体

几何体`Geometry`描述了一个曲面的顶点属性，比如顶点位置信息`vertices`、纹理坐标信息`uvs`、法线数据`normals`等等。这些顶点属性一般通过特定名字交由材质处理，之后在顶点着色器中进行处理。可以认为几何体中的顶点数据决定了3D物体的**初始形状**。

### 默认几何体

Sein默认提供了几种几何体，比如立方体`BoxGeometry`、球体`SphereGeometry`等，但一般不需要自己使用，只要使用其对应的Component或者Actor即可（详见[基本几何体](../basic-components/bsp)）。

### 自定义几何体

有时候我们需要自定义几何体，比如在构建粒子系统的时候。在Sein中自定义几何体很方便，开发者有两种方式进行自定义：直接`new Geometry(attributes)`或者继承自`Geometry`在构造方法`constructor`中对几何数据进行初始化。这二者基本没有区别，唯一要注意的是如果使用继承的方法，则一定要将自定义的属性挂载在实例下，可以用`geometry.xxx`的方式对外取到。处于篇幅考虑，下面就直接以第一种方法为例来描述如何自定义几何体。  

`attributes`，实际上就是一个存有顶点属性集合的表，其基本形式为：

```ts
const attributes = {
  vertices: new Sein.GeometryData(new Float32Array(vertices), 3, null);
  indices: new Sein.GeometryData(new Uint16Array(indices), 1, null);
  uvs: new Sein.GeometryData(new Float32Array(uvs), 2, null);
  normals: new Sein.GeometryData(new Float32Array(normals), 3, null);
};
```

字典的键均为属性的名字，而值则是`GeometryData`类型的数据。GeometryData主要通过一个`TypedArray`类型的一维数组、以及这个数组每次取几个值，来构建一个可被GPU识别的序列。举个例子，对于`vertices`这个属性，提交到GPU后在着色器中就会被识别为`vec3`类型的顶点数据。  

之后直接创建即可：

```ts
const geometry = new Sein.Geometry({attributes});
```
