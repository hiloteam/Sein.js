# PNG压缩处理器

目前Sein官方提供了一个对PNG进行压缩的处理器，其使用了[UPNG.js](https://github.com/photopea/UPNG.js)，采用**pngquant**算法进行优化。

安装：  

```shell
npm i seinjs-png-compress-processor --save-dev
```

使用，以gltf为例：

```js
const PNGCompressProcessor = require('seinjs-png-compress-processor');

{
  ......
  {
    test: /\.(gltf|glb)$/,
    use: [
      {
        loader: 'seinjs-gltf-loader',
        options: {
          ......
          process: {
            enabled: true,
            processors: [
              new PNGCompressProcessor({
                /**
                 * Which files will be processed.
                 * 
                 * @default /\.png/g
                 */
                test: /\.png/g,
                /**
                 * Palette size(how many colors you want to have) if `quantized` is true.
                 * 
                 * @default 256
                 */
                psize: 200,
                /**
                 * You can overwrite settings for each file.
                 */
                custom: (filePath: string) => {
                  if (/haha/.test(filePath)) {
                    return {psize: 100};
                  }
                }
              })
            ]
          }
        }
      }
    ]
  }
}
```
