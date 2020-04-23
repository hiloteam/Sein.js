# 图集

图集可以看做是一种特殊的纹理，如果你是Web前端开发者，那么一定对类似“雪碧图”、“精灵图”这样的名词并不陌生。图集**Atlas**其实也一样，其本质上就是将若干小纹理合并到一张大纹理中，在使用时再通过UV来取得其一部分渲染。

图集的存在对于纹理优化有着巨大的作用，一般我们会使用图集来满足**POT**等约束，这也是压缩纹理所需求的。  

在Sein中，图集通过`AtlasManager`管理，其提供了一个约定的格式和一系列方法，用于方便得创建一个图集，并在其上实现分配、释放、更新一个区域的功能。

## 格式

`AtlasManager`支持的图集格式完全兼容与`PIXIJS`的图集格式，你可以利用Unity扩展来生成，这也是建议的方式，请见[Unity中的图集和精灵](../scene-editor/atlas-sprite)，[ShoeBox](https://renderhjs.net/shoebox/)来生成它（通过生成SpriteSheet），格式具体的定义可以在[IAtlasOptions](../../document/interfaces/iatlasoptions)找到。

## 通过资源加载

图集有两种创建方式，一种就是在通过上述的ShoeBox创建了兼容与PIXIJS的图集（一个Json文件和一张图片）后，利用[AtlasLoader](../../document/classes/atlasloader)来加载：  

>这里使用到webpack的一个loader，详见[seinjs-atlas-loader](../../extension/toolchains/seinjs-atlas-loader)。

```ts
game.resource.load({type: 'Atlas', name: 'miku.atlas', src: require('../../assets/miku.atlas')});

......

const manager = game.resource.get<'Atlas'>('miku.atlas');
```

你也可以直接通过这个实例来感受一下具体的运作：[Atlas加载器](../../example/resource/atlas-loader)。

>当然，如果你是在Unity中创建的图集，那么直接走`GlTFLoader`即可，这个后面会详细讲到，此处不需要过于关注。

## 运行时创建

除了从资源加载，开发者也可以在运行时动态创建一个图集。为了支持各种各样的场景，我们提供了丰富的功能来供开发者自由选择。

### 自由创建

在完全了解图集的分配策略的状况下，你可以直接按照格式自行创建一个图集：

```ts
const manager = new Sein.AtlasManager({
  image,
  frames: {1: {frame: {x: 0, y: 0, w: 54, h: 54}}},
  meta: {size: {w: 512, h: 512}}
});
```

但这种状况其实并不常见，更常见的场合是通过格子创建、或者通过序列帧创建、以及完全动态分配。

### 通过格子创建

`AtlasManager`提供了静态方法`CREATE_FROM_GRID`来根据宽高和行列数来创建一个网格状的图集，这适用于要分配一个规则、均匀的图集的场景：  

```ts
const atlas = Sein.AtlasManager.CREATE_FROM_GRIDS(
  {width: 512, height: 512, rows: 4, cols: 4},
  (atlas, context, region, frameName) => {
    context.drawImage(game.resource.get<'Image'>('bubble.png'), region.x, region.y, region.w, region.h);

    ......
  }
);
```

详见示例[图集-从网格创建](../../example/atlas/from-gird)。

### 通过序列帧创建

有时候我们也需要直接通过一个序列帧来初始化一个图集，这通常出现在要使用精灵动画的场景，所以`AtlasManager`提供了静态方法`CREATE_FROM_TEXTURE`来满足这个需求：

```ts
const atlas = Sein.AtlasManager.CREATE_FROM_TEXTURE(game.resource.get<'Texture'>('black-hole.png'), {
  cellWidth: 128,
  cellHeight: 128,
  framesPerLine: 7,
  frameStart: 0,
  frameCount: 47,
  spacing: 10
});
```

详见示例[图集-从序列帧创建](../../example/atlas/from-texture)。

>当然，这种情况还是建议使用标准图集格式的资源配合`AtlasLoader`加载使用。

### 动态分配

首先看一个简单的示例[图集-基础](../../example/atlas/basic)。这个示例中，我们通过静态方法`CREATE_EMPTY`创建了一个空的图集，然后使用`allocateFrame`方法动态分配了一帧，然后在定时器每个Step来使用`updateFrame`方法对其进行更新，在更新时，被引用的图集的纹理资源的**这个区域**也会自动被提交到GPU。

这就是图集最强大的使用方式——动态分配和释放帧，来实现少量的离屏Canvas下提供大量纹理的能力，这个对内存使用、性能等是一个很好的优化。

下面让我们再通过另一个示例来感受一下动态图集：[动态分配释放](../../example/atlas/allocate-release)。

>注意分配失败会返回`null`，记得自行处理。

>要注意动态图集并不适合所有场景，在很多场景下你仍然需要自己采用Canvas绘制、提取、创建纹理，这一般用于对内存极端敏感的场景。

## 作为纹理使用

创建了图集管理器的实例后，开发者便可以用多种方法来使用它，其中最简单的方式就是`getFrameImage`或`getTexture`，这两个方法可以通过某一帧的名字，来直接获得该帧的图像或者纹理。**但需要注意，由于是直接获取单帧数据，所以会创建单独的离屏Canvas，这可能会造成一些内存碎片，一般不建议这么使用！**  

稍微复杂一些但是更稳妥的做法是利用`getWholeTexture`方法或`texture`属性获取整个图集大图的纹理，之后通过`getFrame`或者`getUVMatrix`方法来获取一帧的像素坐标/UV变换矩阵，在利用这个去进行绘制：  

```ts
const texture = manager.texture;
const uvMatrix = manager.getUVMatrix('1');

material.setUniform<Sein.Texture>('u_diffuseMap', texture);
material.setUniform<Sein.Matrix3>('u_uvMatrix', uvMatrix);
```

```glsl
vec2 uv = (u_uvMatrix * vec3(v_uv, 1.)).xy;

gl_FragColor = texture2D(u_texture, uv);
```

## 进阶

有时候开发者可能会有自己维护一个**图集池**，来动态分配的场景。这可能需要了解每个图集的使用情况，此时可以用`atlas.usage`方法来获得当前使用率，范围为`0 ~ 1`。

通过使用率，有时候可能需要自己控制是否要重排整个图集，这时候可以使用`rebuildFrames`方法。
