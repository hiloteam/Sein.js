# 支付宝降级组件

>仅对支付宝开发者有效。

通过大型项目的洗练，我们总结出了一套面对与支付宝内的业务的通用降级组件，它可以拥有众多能力，能协助你对SEIN.JS项目进行全方位的可用性检查。

## 维度

1. 安卓黑名单、iOS版本.
2. 安卓低性能设备.
3. 内存红线。
4. 不支持WebGL.
5. 无障碍。
6. 自定义强制降级。
7. 非UC内核。
8. 压缩纹理。（自行调用）
9. 三次闪退降级。（待定）

## 使用

首先安装：

```sh
tnpm i @alipay/seinjs-fallback --save
```

然后：

```ts
import {init, checkFallback, checkCompressTexture} from '@alipay/seinjs-fallback';

// 初始化
await init();

// 检测通用降级策略
const res = await checkFallback(options);
if (res.fallback) {
  console.log(res.reasons);
  ......
}

// 检测压缩纹理支持
const res = await checkCompressTexture(game);
if (res.fallback) {
  console.log(res.reason);
  ......
}
```

## 接口文档

接口配置文档请见：[API文档](http://gitlab.alipay-inc.com/paradise/seinjs-fallback/blob/master/doc/globals.md)。

