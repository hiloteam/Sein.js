# seinjs-url-loader

这是一个webpack的loader，基本功能等同于**url-loader**但内容更加丰富，提供了生产环境自定义发布器发布到CDN的能力，还可以通过自定义预处理器来对图片资源进行预处理，可以满足各种需求。

## 使用

先安装：

```bash
npm i seinjs-url-loader --save-dev
```

之后在webpack.config.js之中添加配置(如果你走的是seinjs-cli通过**sein new**则已经默认配好了)：

```js
{
  test: /\.(png|jpg|mp3)$/,
  use: {
    loader: 'seinjs-url-loader',
    options: {......}
  }
}
```

具体配置请见Readme：[seinjs-url-loader](https://github.com/hiloteam/seinjs-url-loader)。

## PNG压缩

通过预处理器可以对很多资源进行优化操作，Sein官方实现了对PNG进行压缩的预处理器，详见[png-compress-processor](./PNG压缩处理器)。

## 发布CDN

很多时候我们需要在生产环境发布时，将资源发布到CDN，本Loader提供了这个口子，详见[资源发布-通过配置loader和工具发布](./resource-publisher#通过配置loader和工具发布)。
