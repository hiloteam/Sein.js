# seinjs-atlas-loader

提供将Sein支持的Atlas格式引入Webpack流程的能力，提供了生产环境自定义发布器发布到CDN的能力，还可以通过自定义预处理器来对图片资源进行预处理。

## 使用

先安装：

```bash
npm i seinjs-atlas-loader --save-dev
```

之后在webpack.config.js之中添加配置(如果你走的是seinjs-cli通过**sein new**则已经默认配好了)：

```js
{
  test: /\.(atlas)$/,
  use: {
    loader: 'seinjs-atlas-loader',
    options: {......}
  }
}
```

## atlas格式和生成

AtlasManager支持的图集格式完全兼容与PIXIJS的图集格式，你可以利用Unity扩展来生成，这也是建议的方式，请见[Unity中的图集和精灵](./unity-atlas-sprite.md)，你可以利用[ShoeBox](https://renderhjs.net/shoebox/)来生成它（通过生成SpriteSheet），格式具体的定义可以在[IAtlasOptions](../../document/interfaces/iatlasoptions)找到。

## PNG压缩

通过预处理器可以对很多资源进行优化操作，Sein官方实现了对PNG进行压缩的预处理器，详见[png-compress-processor](./PNG压缩处理器)。

## 发布CDN

很多时候我们需要在生产环境发布时，将资源发布到CDN，本Loader提供了这个口子，详见[资源发布-通过配置loader和工具发布](./resource-publisher#通过配置loader和工具发布)。
