# seinjs-gltf-loader

这是一个webpack的loader，提供在Webpack流程中，加载gltf/glb文件的功能。支持模型压缩、压缩纹理转换、转换Base64、打包glb等功能，拥有丰富的定制化配置，提供了生产环境自定义发布器发布到CDN的能力，还可以通过自定义预处理器来对图片资源进行预处理，可以满足各种需求。

## 使用

先安装：

```bash
npm i seinjs-gltf-loader --save-dev
```

之后在webpack.config.js之中添加配置(如果你走的是seinjs-cli通过**sein new**则已经默认配好了)：

```js
{
  test: /\.(gltf|glb)$/,
  use: {
    loader: 'seinjs-gltf-loader',
    options: {......}
  }
}
```

具体配置请见Readme：[seinjs-gltf-loader](https://github.com/hiloteam/seinjs-gltf-loader)。

## 模型压缩

要注意在使用`compress`选项进行模型压缩时，相应得可以在运行代码里你可以配置是否使用**WebAssembly**和**Worker**进行解压缩，这由下面三个参数控制：

```ts
// 是否自动判断
Sein.AliAMCExtension.useAuto = false;
// 是否使用WASM
Sein.AliAMCExtension.useWASM = false;
// 是否使用Worker
Sein.AliAMCExtension.useWebWorker = false;
```

Worker和WASM会提升解压性能和防止解压卡顿，但会多出十几M内存开销，这点需要注意！

## 压缩纹理使用

Sein完全支持压缩纹理的使用（通过`KTX`做容器支持），视情况可降低**5倍以上**的纹理内存占用。为了极大优化开发体验，我在`gltf-loader`中加入了对于压缩纹理的配置，来帮助开发者顺畅、无感知地使用压缩纹理，你只需要提供原始的`jpg`、`png`纹理等，loader就会帮你自动生成不同类型的压缩纹理，这些类型是可配置开启的，比如ASTC、PVRTC会默认开启，以及对不支持压缩纹理的平台（默认转换为RGBA4444和RGB565）一起，生成几个gltf/glb入口，并在引擎Runtime帮你自动处理好加载依赖的管理：

```js
{
  ......
  options: {
    ......
    compressTextures: {
      enabled: true
    }
    ......
  }
}
```

如这段代码，你只需要开启`compressTextures`功能，一切都会自动完成。比如在加载`test.gltf`并开启了`glb`后，会生成名为`test-pvrtc-md5.glb`、`test-astc-md5.glb`、`test-fallback-md5.glb`三个入口，并在资源加载时自动确定加载哪一个。

当然loader也提供了更多的选项，包括`quality`和`excludes`，请按需使用。

>压缩纹理生成最终受到Unity扩展导出产物影响，主要是`normalMap`和`透明纹理`会采用较高质量，纹理的`generateMipmap`选项也会影响到最终压缩纹理是否生成Mipmaps，不需要可以导入时关闭。

## PNG压缩

通过预处理器可以对很多资源进行优化操作，Sein官方实现了对PNG进行压缩的预处理器，详见[png-compress-processor](./PNG压缩处理器)。

## 发布CDN

很多时候我们需要在生产环境发布时，将资源发布到CDN，本Loader提供了这个口子，详见[资源发布-通过配置loader和工具发布](./resource-publisher#通过配置loader和工具发布)。
