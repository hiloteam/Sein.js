# 纹理

纹理(Texture)是3D图形渲染中最重要的概念之一，其本质上可以看做是一个二维数组（第二维度定长，所以实际上以一维数组存储），作为高密度、高对齐的数据，十分适合GPU进行存取。你可以认为纹理是“图片”的一种数据化体现，而实际上在硬盘中其基本也是被作为图片来存储的，它的功能很多，最常见的就是用于各种各样的“贴图”，比如“漫反射贴图”、“法线贴图”等等。  

## 基础纹理

基础纹理[Texture](../../document/classes/texture)，一般用于将一张图片或者Canvas转换为纹理数据，一般而言，你只需要传入一个图片对象即可生成一个纹理，最多也不过就是再翻转一下其Y轴：  

```ts
const texture = new Sein.Texture({image: game.resource.get<'Image'>('test.png'), flipY: true});

// 使用新纹理作为材质的漫反射贴图
material.getUniform('u_diffuseMap').value = texture;
```

## 惰性纹理

惰性纹理大致与基础纹理一致，但其是**惰性加载**的，并且初始化的时候也主要是使用`src`字段来替代`image`字段。其核心功能在于延迟图片资源的加载，减少模型初始化的时候的网络开销，当然你也可以使用`autoLoad`字段使其强行不进行惰性加载：  

```ts
const texture = new Sein.LazyTexture({src: '/assets/xxxxx.jpg'});

// 被使用了，开始加载
material.getUniform('u_diffuseMap').value = texture;
```

## 通过资源管理器载入

纹理资源具有其特定的资源加载器，所以可以通过资源管理器进行载入，其载入后是一个普通纹理，你可以配置它的`crossOrigin`属性来决定是否允许其跨域：  

```ts
game.resource.load({type: 'Texture', name: 'myTex.tex', src: '/assets/xxxxx.jpg'});
```

## 动态纹理

>注意动态纹理的离屏Canvas开销！

动态纹理，顾名思义，就是可以在运行时变化的纹理。动态纹理的定义在[DynamicTexture](../../document/classes/dynamictexture)，其会默认创建一个离屏Canvas作为画布来让你进行绘制，并将变动实时同步到GPU中，让我们以一段代码为例来看看如何使用它：  

```ts
const texture = new Sein.DynamicTexture({
  onInit(context: CanvasRenderingContext2D, options: IDynamicTextureOptions) {
    const {width, height} = options;
    context.fillText('0', width / 2, height * 0.65, width);
  },
  onDraw(context: CanvasRenderingContext2D) {
    const {width, height} = this;
    const text = `${~~(Math.random() * 10)}`;
    context.clearRect(0, 0, width, height);
    context.fillText(text, width / 2, height * 0.65, width);
  },
  width: 256,
  height: 256,
  flipY: true
});

// 初始化完毕后，每一次调用`draw`方法都会触发`onDraw`生命周期。
texture.draw();
```

这段代码中，我们创建了一个动态纹理，为其指定了256的宽高，之后在`onInit`即其初始化时绘制了一个`'0'`的字符，之后每一次手动调用`draw`都会在`onDraw`中随机绘制一个0-9之间的字符。  

动态纹理一般用于创建一些需要实时生成的贴图，比如一些随机的价格标签。当然，如果觉得上面的方法还不够灵活，你也可以选择直接继承`DynamicTexture`类来高度自定义自己的动态纹理。

## 立方体纹理

立方体纹理`CubeTexture`允许你指定一个立方体的六个面，并在着色器中直接通过`textureCube`来采样达到像是天空盒一样的效果，其使用也很简单：  

```ts
const texture = new Sein.CubeTexture({
  left: '/assets/sky/left.png',
  right: '/assets/sky/right.png',
  front: '/assets/sky/front.png',
  back: '/assets/sky/back.png',
  top: '/assets/sky/top.png',
  bottom: '/assets/sky/bottom.png'
});
```

```glsl
vec4 diffuse = textureCube(u_diffuse, v_position);
```

### 数据纹理

数据纹理即完全由开发者掌控的纹理，其不以图片而是以`TypedArray`作为来源，简而言之就是开发者可以直接构造一个结构和图片一样的ArrayBuffer来构成纹理：  

```ts
const texture = new Sein.DataTexture({data: new Uint8ClampedArray([r1, g1, b1, a1, ......])});
```

这种纹理在着色器中的使用和普通纹理一致，通过采样即可。

## 优化

为了最大化优化纹理内存使用，我们提供了一个参数`isImageCanRelease`，你可以在构造纹理时将其传入，其目的是纹理提交到GPU后就不再占用CPU端内存，会自动释放掉。

但要特别注意使用的时机，以及其副作用（可能无法从**GL上下文丢失**中恢复）。
