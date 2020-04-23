# 全局默认加载器

资源管理器和事件管理器一样，也可以通过泛型来指定默认资源和加载器的对应来利于类型推断，这个泛型参数即为`ResourceManager`的`IDefaultLoaders`参数。其结构如下：  

## 声明全局加载器

```ts
{
  GlTF: {
    entity: IGlTFResourceEntity;
    instantOptions: IGlTFInstantOptions;
    instantResult: IGlTFInstantResult;
  };
  ......
}
```

其中每一项的键是资源的类型，每一项值中的`entity`对应该类型资源对应的实体类型、`instantOptions`对应实例化参数类型、`instantResult`对应实例化结果类型。

## 实例

这里有一些实际使用的例子：[图片加载器](../../example/resource/image-loader)、[纹理加载器](../../example/resource/texture-loader)、[立方体纹理加载器](../../example/resource/cube-texture-loader)、[图集加载器](../../example/resource/atlas-loader)、[GlTF加载器](../../example/resource/gltf-loader)。
