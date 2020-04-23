# 资源发布

资源发布目前主要是gltf资源和atlas资源等发布，发布到CDN。

## 通过配置loader和工具发布

`seinjs-gltf-loader`和`seinjs-atlas-loader`等Loader都添加了同样的一种配置`publish`，这种配置可以来让开发者决定是否在处理**独立产物**时走自定义流程并返回特定值，以GlTF为例，让我们看看类型定义：

```js
{
  test: /\.(gltf|glb)$/,
  use: [
    {
      loader: 'seinjs-gltf-loader',
      options: {
        ......
        // for publishing your resource to cdn
        publish?: {
          // Enable publish
          enabled: boolean;
          // Rules for excluding unnecessary files
          excludes?: (RegExp | ((path: string) => boolean))[];
          // You custom publisher
          publisher: {
            publish(options: {data: Buffer | string, filePath: string, distPath: string}): Promise<string>;
          };
        };
      }
    }
  ]
}
```

对于`publish`配置项，最重要的参数是`publisher`，这是一个用户可以自定义的发布器，用于处理资源产出到CDN的流程。

## 发布到蚂蚁CDN

目前我们官方提供了一个发布资源到蚂蚁CDN的发布器，请按照需求使用。

>仅对蚂蚁开发者有效。

安装：  

```shell
tnpm i @alipay/seinjs-alipay-cdn-publisher --save-dev
```

使用，以gltf为例：

```js
const Publisher = require('@alipay/seinjs-alipay-cdn-publisher');

{
  ......
  {
    test: /\.(gltf|glb)$/,
    use: [
      {
        loader: 'seinjs-gltf-loader',
        options: {
          ......
          publish: {
            enabled: !isDev,
            excludes: [],
            publisher: new Publisher({
              // 必选，资源仓库前缀，建议项目名
              prefix: 'haha',
              // 可选，发布到内网还是公网，默认内网
              // 内网为`internal`，公网为`public`
              mode: 'public',
              // 若有需求，你也可以配置自己Basement项目的仓库
              customAPP: {
                appName: 'appName',
                appId: 'appId',
                masterKey: 'masterKey'
              }
            })
          }
        }
      }
    ]
  }
}
```
