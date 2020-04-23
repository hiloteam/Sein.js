
# 材质

在现实生活中，我们提起材质，一般都会想到“粗糙”、“光滑”、“镜面”这些词，从视觉上来讲，一个“粗糙”材质的表面可能凹凸不平、“镜面”材质择则有反射能力，也就是说，视觉意义上的“材质”，本质上决定了眼睛看到的效果和感觉。那么类比到渲染系统中，材质，实际上是一种渲染方式的表达——它直接决定了我们看到的3D物体时什么样子的。  

在渲染系统中，材质通过描述3D物体的渲染方式，决定了3D物体**最终的形状和颜色**。一般而言，材质通过`attributes`、`uniforms`、`vs`与`fs`（着色器）以及其他flag来定义渲染方式。其中`attributes`是顶点属性描述；`uniforms`可以理解为外观属性，可以通过其来使得顶点属性一致的曲面拥有不同的渲染行为；着色器则是一种运行在GPU上的程序，可以让开发者决定如何利用`attributes`和`uniforms`进行渲染；而其他flag，指的是可以控制渲染行为的参数，比如`blend`系列方法、`side`属性等等，可以进行更为精细的渲染控制。  

在运行时，一般不建议切换`vs`、`fs`和`attributes`，但可以通过修改`uniforms`中的参数配合着色器来达到目的，这个在下面会讲到。

## 内置材质

Sein提供了一些内置材质，一般情况下你可以直接使用它们来达到较为理想的效果。

### PBRMaterial

PBRMaterial，即基于物理的渲染材质，采用了PBR光照模型，其模型设计为更加逼近于真实感的渲染，也是一个可靠、标准化的光照模型。在Sein中，如果需要光照，一般情况下非常建议使用PBR材质来作为基础材质，这样比较利于和未来接轨，同时Sein的Unity扩展默认走的也是PBR。  

PBR材质较为复杂，一般不自行创建，而是在Unity中调好后通过扩展导出为GlTF文件，通过引擎加载实例化后自动创建。想详细了解这个材质可见各个PBR的教程，Sein提供的PBR能力可见文档[PBRMaterial](../../document/classes/pbrmaterial)。  
你可以直接在Unity中使用Sein标准PBR材质，并最终达到完全一致的效果，详见[使用Unity扩展](../scene-editor/unity-extension)中的**材质**一节。

### BasicMaterial

BasicMaterial是比较老的材质，效果一般性能较好，一般不建议直接使用，其实际上集成了四种经典光照模型，可以在初始化的时候通过切换`type`参数来定义使用哪种光照模型：  

```ts
const material = new Sein.BasicMaterial({
  diffuse: new Sein.Color(1, 0, 0),
  lightType: 'PHONG'
});
```

这段代码就是用了`PHONG`类型的光照模型，并为漫反射属性初始化为了红色。在实例[立方体](../../example/bsp/box)可以查看`PHONG`光照模型在平行光下的实际效果。  

处理`PHONG`模型，BasicMaterial还提供了`BLINN-PHONG`、`LAMBERT`两种模型，以及无光照模型`NONE`。在无光照的情况下，只有`diffuse`参数会产生左右，其他光照属性颜色/贴图均无效果，适合低端设备。

更多参数可以在[BasicMaterial](../../document/classes/basicmaterial)中查看。

## 渲染顺序

在Hilo更新后，Sein也提供了渲染顺序的支持。可以在派生的材质类定义或者材质初始化的时候设定其渲染优先级，来达到类似HUD这样的物体的渲染效果（需要关闭深度测试），即一直渲染在顶部等，实际使用例子可见[渲染顺序](../../example/render/render-order)。

## RawShaderMaterial

如果默认材质满足不了你的需求，Sein也提供了自定义材质的方式。通过[RawShaderMaterial](../../document/classes/rawshadermaterial)，开发者可以完全从头定义自己的材质。此材质不会有任何预制的`attribute`和`uniform`，适合想完全控制整个材质的开发者。  

要使用该材质，主要是需要指定两个着色器`vs`、`fs`，以及`uniforms`、`attributes`和`defines`等：  

### vs和fs

`vs`和`fs`即着色器代码，可以有两种类型。其一即单纯的字符串，这种情况下改字符串将会被直接编译；第二种则是`{header: string, main: string}`这种形式，这种形式其实主要用于`ShaderChunk`，不使用`ShaderChunk`的话，在这里仅仅是简单得将二者拼接起来编译。

### define

`define`字段一般用于定义`vs`和`fs`通用的宏，在编译shader前这个字段中的内容会被拼接到着色器实际内容的前面。

### attributes

`attributes`用于连接顶点属性和着色器中的`attribute`类型变量，其是一个字典，键为要在着色器中使用的名字，值可以为sematic，也可以为类型为`{name: sting}`的对象。  

所谓`sematic`，其实是一种预定义的属性，在Sein中，很多常用的顶点属性和Uniform都被定义了sematic。比如`'POSITION'`这个sematic就代表了顶点属性”位置“（即默认为几何体数据中的`vertices`属性），在实际使用中，直接传入`{attributes: {a_position: 'POSITION'}}`即可在着色器中用`attribute vec3 a_position;`取得顶点数据。默认支持的`attributes`相关的sematic请见[TMaterialDefaultAttribute](../../document/globals.html#tmaterialdefaultuniforms)。  

若sematic不能满足需求，必须要直接通过几何体的数据映射到材质中，Sein也提供了一个简单的方法。比如上面的顶点位置属性，可以直接这么写：`{attributes: {a_position: {name: 'vertices'}}}`。这种定义直接通过几何体中对应属性的名字作为来源，将其映射到着色器中对应的变量。

### uniforms

`uniforms`被用于传递运行时可变的属性，比如变换举证、时间、贴图等等。在Sein中，同样为其定义了两种指定方式。第一种也是sematic，比如我们想传入模型视图投影矩阵，就可以直接使用`{uniforms: {u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION'}}`，然后再着色器中用`uniform mat4 u_modelViewProjectionMatrix;`来获取它。默认支持的`uniforms`相关的sematic可见[TMaterialDefaultUniforms](../../document/globals.html#tmaterialdefaultuniforms)。  

若sematic，则可以通过第二种方式来定义。比如我们想将传入一个时间参数，就可以使用`{uniforms: {u_time: {value: 0}}}`这种形式。目前Sein支持的`uniform`的`value`类型为`Texture | number | number[] | Vector2 | Vector3 | Vector4 | Matrix3 | Matrix4 | Color`，对应于着色器中的数据类型顾名思义，不再赘述。

### 实例

详细可以看实例[RawShaderMaterial](../../example/material/raw-shader-material)，介绍了如何创建和使用。

## 动态修改Uniform

在创建了一个材质后，我们可能希望去动态更新它的一些uniform，比如一些材质动画，需要引入时间变量`u_time`，那么有三种做法做这件事：  

```ts
// 首先获取具体的图元组件
const mesh = actor.root as Sein.StaticMeshComponent;

// 先获取再修改
mesh.material.getUniform<number>('u_time').value = 1;

// 直接修改
box.root.material.setUniform<number>('u_time', 1);

// 通过当前值以及回调修改
mesh.material.changeUniform<number>('u_time', value => value + 1);
```

## ShaderMaterial

[ShaderMaterial](../../document/classes/shadermaterial)基于RawShaderMaterial，只不过其默认包含了一些常见的`define`、`attributes`和`uniforms`以及`vs`和`fs`中的headers，开发者可以略过这些参数（比如`a_position`、`u_modelViewProjectionMatrix`）的定义，直接在着色器中使用。具体可见例子[Shader材质](../../example/material/shader-material)。

## SMaterial

`SMaterial`是一个装饰器，其用法和`SClass`类似，不过是用于装饰`RawShaderMaterial`的派生类的。此装饰器用于”反射“，其会在全局给目前定义过的材质建立索引，并在需要使用的时候来用他们。在这些用法里，最为重要的就是——通过这种定义，便可以在GlTF文件中利用Sein的扩展，为其中的模型指定前端编写的、派生自`RawShaderMaterial`材质了。  

如何在GlTF文件中指定材质将在后续章节[GlTF模型](../scene-editor/gltf)中说到。这里先说明如何去实现一个可在GlTF被使用的材质：  

```ts
@Sein.SMaterial({className: 'FxMaterial'})
export default class FxMaterial extends Sein.RawShaderMaterial {
  constructor(options: {
    uniforms: {
      u_opacity: {value: number},
      u_diffuseMap: {value: Sein.Texture}
    }
  }) {
    super({
      attributes: {
        a_position: 'POSITION',
        a_uv: 'TEXCOORD_0'
      },
      uniforms: {
        u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
        u_opacity: options.uniforms.u_opacity,
        u_diffuseMap: options.uniforms.u_diffuseMap
      },
      vs: ......,
      fs: ......
    });
  }
}
```

这段代码中，我们继承自`RawShaderMaterial`实现了一个新的材质类，并为其添加了装饰器`SMaterial`用于指定其类名为`FxMaterial`。在具体实现中，我们重写了构造方法，为其指定了一个`option`参数，参数中拥有`uniforms`属性并在构造方法中取其中的值来作为实际的`uniform`变量初始值。  

这么写看起来是很啰嗦，而且确实也不是必要的——如果你不需要反射。假如你需要反射，那么这种写法就是一种**强约定**，必须得这么写，也就是说——必须要重写构造方法，并在构造方法中指定一个且仅有一个类型接口扩展自为`{uniforms: {[key: string]: IMaterialUniform}}`的参数。

## ShaderChunk

[ShaderChunk](../../document/classes/shaderchunk)即Shader块，其用于对一些通用材质中的部分进行复用，可以用搭积木的方式堆积材质。不过这部分对于绝大部分场景暂时用处不大，后续再继续编写教程，有兴趣的可以先自己看看这个实例：[Shader块](../../example/material/shader-chunk)。

>我们在寻找更好的方式，敬请期待。

## 全局Uniform自定义semantic

有时候我们希望创建一些拥有全局Uniform的材质，这些Uniform在修改是会影响全局所有用到它们的材质。典型比如“相机的视图矩阵”、“灯光信息”等。Sein提供了两种方法来做这个事，详细可以看实例[自定义全局Uniform](../../example/material/global-uniform-material)和[自定义Semantic](../../example/material/custom-semantic)的做法。

## 自定义渲染配置

有时候我们希望可以在运行时通过不同的Uniform的值来生成不同的宏，来控制Shader的行为，这时候就可以`getCustomRenderOption`方法来实现，详细用法可以看实例[修改渲染配置](../../example/material/render-options)，但要注意修改宏会导致重新编译Program，性能开销需要评估。
