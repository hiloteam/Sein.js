# 后处理系统

后处理指利用一些经典的图像处理算法，在片段着色阶段对整个渲染出来的场景进行处理，用于实现一些全屏的后期效果。比如全屏泛光、阈值化、局部滤波等等。在Sein中，利用`RenderSystemActor`的能力，提供了一个用于后处理的系统Actor——`PostProcessingSystemActor`。  

## 使用

要使用它，首先安装：  

```shell
npm i seinjs-post-processing-system --save
```

之后直接引入使用：  

```ts
import 'seinjs-post-processing-system';

......

const pps = game.addActor('threshold-system', Sein.PostProcessingSystem.Actor);
pps.addPass({
  name: 'pass1',
  fs: `
    precision mediump float;
    uniform sampler2D u_preMap;
    varying vec2 v_texcoord0;

    void main() {
      vec4 color = texture2D(u_preMap, v_texcoord0);
      float gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
      gl_FragColor = gray > 0.7 ? vec4(1., 1., 1., 1.) : vec4(0., 0., 0., 1.);
    }
  `
});
```

此例中，我们添加了一个处理阶段`pass`，指定了一个片段着色器`fs`，在里面对上一次处理的结果纹理`u_preMap`进行了阈值化。  

## 设计

后处理系统的设计足以应对大多场合，其关键是每一个Pass的类型接口`IPass`：  

```ts
export interface IPass {
  /**
   * Pass名称，将用于缓存。
   */
  name: string;
  /**
   * 片段着色器。默认有上一次处理结果纹理`uniform u_preMap`、原始画面渲染纹理`uniform u_origMap`和UV坐标`varying v_texcoord0`三个变量。
   */
  fs: string;
  /**
   * FrameBuffer的设置，也可以指定`scaleW`和`scaleH`来对每一个Pass的渲染尺寸进行缩放。
   */
  frameOptions?: Sein.IFrameBufferOptions & {scaleW?: number, scaleH?: number};
  /**
   * 要自己添加的`uniforms`。
   */
  uniforms?: {[name: string]: Sein.IMaterialUniform};
  /**
   * 每一次渲染的时候都会调用，用于更新`uniforms`。
   */
  updateUniforms?(uniforms: {[name: string]: Sein.IMaterialUniform}): void;
}
```

简单来说，主要就是利用原始渲染结果`u_origMap`和上一个Pass的渲染结果`u_preMap`与UV坐标来实现单纯对纹理的后期处理。  

## 实例

我们提供了丰富的实例来展示后处理系统的效果——[全局阈值化](../../example/post-processing-system/threshold)、[局部阈值化](../../example/post-processing-system/local-threshold)、[泛光](../../example/post-processing-system/bloom)。

更详细的API文档可见[PostProcessingSystem](https://github.com/hiloteam/seinjs-post-processing-system/blob/master/doc/README.md)。  
