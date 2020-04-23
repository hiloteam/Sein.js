# glTF和实例化

如果你有一些3D游戏编程或者建模经验，那么一定多一些3D模型的格式有所了解。最常见的如明文格式OBJ、通用传统各式FBX、Maya的mt、DX支持的X格式等等，都被广泛引用在各个领域。但这些传统格式都有一个问题——要么标准性差、要么扩展性差，比如你要让FBX来存储PBR材质的信息，就没那么容易。  

glTF是KhronosGroup近年来提出的一种标准模型格式，从某种意义上你可以认为它是3D场景序列化的一种标准解决方案。其方案非常简单明确，基本由一个存储节点、曲面、材质、纹理、动画等等**索引信息**的`json`格式的`.gltf`文件，同时还提供了一个二进制`.bin`文件用于存储实际的顶点、动画信息等，而这个二进制文件中的数据和GL所需格式基本一致，这大幅降低加载延迟、提升了首屏速度。  

由于单文件足以描述多个场景，也可以用多文件来做传统意义上的资源分割，所以glTF格式尤其适用于WebGame这种异步资源的场景。同时其还提供了强大的可扩展性，开发者可以自己根据需求来编写扩展增强文件的描述能力，Sein中就提供了很多扩展来对其进行高度定制。  

glTF格式是如此好用，以至于现在大部分主流的Web3D引擎都对其提供了良好的支持，像Three、Babylon等还放弃了之前自己的序列化方案，转向glTF。

## 基本结构

glTF文件格式的基本定义可见[glTF-Specification](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0)。简单来讲，其基本分为以下几个部分：  

1. `node`：此字段是场景中携带Transform的最基本单元，下面可挂载`mesh`、`camera`、`light`等等。
2. `scenes`和`scene`：`scenes`字段是一个列表，包含若干“场景”的定义，每个场景都有自己的名字和`nodes`列表，指这个场景会包含哪些节点。而`scene`字段则是要加载的默认场景索引。
3. `meshes`：此字段定义了子模型的信息，其下包括名字`name`、图元列表`primitives`，primitives又包含顶点属性索引`attributes`（将从.bin文件中获取）、顶点访问器索引`indices`、材质索引`material`和光栅化渲染模式`mode`等等。
4. `materials`：此字段是一个列表，定义了所有的材质信息，每个材质又根据技术有不同的信息，比如`pbrMetallicRoughness`等等，同时也有一些公共信息，比如`doubleSided`、`alphaMode`等等。
5. `textures`：此字段是所有纹理资源的列表，每个纹理资源通过指定采样器索引`sampler`和图像源`source`来指定。
6. `samplers`：定义所有采样器的列表，采样器用于规约对纹理的采样模式，包括`magFilter`、`warps`等等。
7. `images`：定义所有图像资源的列表，作为纹理采样的源。
8. `accessors`：二进制文件的访问器列表，用于定义顶点数据、动画数据等等的访问方式，每一个都可以指定数据类型`type`、最大最小值、字节偏移量`byteOffset`、bufferView索引`bufferView`等。
9. `bufferViews`：从具体的`buffer`数据中定义所有的二进制数据分割，指定每一个分割的长度`byteLength`和偏移`byteOffset`。
10. `buffers`：定义所有二进制数据的来源，通过URI指定。
11. `animations`：定义所有的动画信息，每一个都有自己的名字`name`、通道列表`channels`和采样器`samplers`，通道定义变换的节点和属性以及采样器，采样器则定义输入输出和插值方式。
12. `extensions`：指定全局的扩展，比如`KHR_techniques_webgl`，同时有`extensionsUsed`和`extensionsRequired`字段来指定需求的扩展列表。
13. 其他`extensions`：也有一些扩展是依附于`node`或者`material`等等的，这些扩展一般直接挂载在具体的节点或者材质下面，用于特例化，下面将说道的Sein专用扩展中基本都是这样的扩展。

可以看到，glTF里面很多定义都是通过索引来引用，这样的结构在复用性、扩展性和灵活性上都非常优秀。

## GLB

Sein也支持glTF合并打包的GLB文件，这个是通过Loader提供支持的，详见[seinjs-gltf-loader](../../extension/toolchains/seinjs-gltf-loader.md)。

## 实例化

在前面[资源管理](../resource)一章，我们提到了`resource.instantiate`方法，其可以根据不同的资源类型实例化出不同的对象，而目前唯一可用于实例化的资源就是glTF模型。下面就让我们看看这个实例化具体是如何操作的。

```ts
const modelActor = resource.instantiate('model.gltf', {
  name: 'myModel',
  Class: CustomModelActor
});
```

这段代码中，我们使用`instantiate`方法实例化了资源`model.gltf`，并通过第二个人配置参数，为其指定了名字`name`和要进行实例化到的类`Class`。此方法根据不同的模型还有更丰富的配置选项，但一般而言除了`name`不需要传递任何参数，默认的即可，因为大部分信息已经在glTF文件中有描述。  

>注意，如果想使用更细致的配置来实例化glTF模型，先务必仔细阅读其实例化参数接口文档[IGlTFInstantOptions](../../document/interfaces/igltfinstantoptions)！
