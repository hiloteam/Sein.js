# 资源加载器

资源管理器可以被视为一个单纯的资源容器，其具体的功能比如`load`、`instantiate`等都是被代理到具体的资源加载器[ResourceLoader](../../document/classes/resourceloader)中实现的。通过继承`ResourceLoader`实现特定的资源加载器，并注册它们，我们可以扩展任何需要的资源类型的加载、实例化等等功能。

## 实现

资源加载器的实现十分简单，理论上只需要继承`ResourceLoader`并重写其中的一两个方法即可，这里以`ImageLoader`为例：  

```ts
export interface IImageResourceEntity extends IResourceEntity {
  type: 'Image';
  crossOrigin?: boolean;
  result?: HTMLImageElement;
}

@SClass({className: 'ImageLoader'})
export default class ImageLoader extends ResourceLoader<IImageResourceEntity> {
  public static FORMATS = ['.png'];

  public isImageLoader = true;

  public async load(
    entity: IImageResourceEntity,
    callbacks: {
      onLoading(entity: IImageResourceEntity, progress: number): void;
      onLoaded(entity: IImageResourceEntity): void;
      onError(entity: IImageResourceEntity, error: Error): void;
    }
  ) {
    const image = document.createElement('img');

    image.onload = () => {
      entity.result = image;
      callbacks.onLoaded(entity);
    };

    image.onerror = () => {
      callbacks.onError(entity, new Error(`Error when loading ${entity.name}`));
    };

    image.crossOrigin = (entity.crossOrigin || false) ? 'Anonymous' : '';
    image.src = entity.url;
  }

  public instantiate(entity: IImageResourceEntity, options: IInstantOptions): any {
    throw new Error('Not implemented !');
  }

  public release(entity: IImageResourceEntity): any {

  }
}
```

这段代码中，我们首先通过继承`IResourceEntity`实现了`IImageResourceEntity`，为其添加了一些该资源加载器可加载实体的特有参数，并将其作为泛型参数传给了`ResourceLoader`来实现 `ImageLoader`。  

我们还添加了`FORMATS`静态属性，来告诉资源系统，注册此加载器的时候，默认将这些格式和加载器绑定起来。之后加载时不传`type`则会根据资源`url`的扩展名自行判断。

之后便是`ImageLoader`的核心实现了，对于图像资源而言，唯一重要的方法就是加载方法`load`。`load`方法接受两个参数，一个是要加载的实体`entity`，这个实体的类型和`ResourceLoader`的泛型参数一致，还有一个就是存储着几个特定回调函数的对象`callbacks`，其中包含在加载过程中的回调`onLoading`、加载完成时的回调`onLoaded`以及加载出错时的回调`onError`。在具体实现中，只需要根据实体对象`entity`中的数据初始化加载，并在加载过程中根据不同的状况触发相应的回调即可。

实例化方法`instantiate`对于图像资源并没有什么意义，所以这里并没有实现它（此处不显式定义也可以，基类有有默认实现），但对于GlTF这种模型资源是存在这个方法的重写的。此方法有两个参数，第一个参数是实体对象，第二个则是继承自`IInstantOptions`的实例化参数，最终返回的则是根据状况产生的不同结果。  

最后是`release`方法，其将会在手动使用资源管理器的`release`或者`clear`方法进行资源释放时调用，用于进行资源的彻底释放，比如对于GlTF资源，其释放行为就是完全销毁此模型创建过的所有Gl资源。此举会有一定的开销，建议在关卡切换时统一释放。

## 注册

实现了特定的资源加载器，接下来便可以在资源管理器中注册它以启用：  

```ts
resource.register('Image', ImageLoader);
```

如果想关闭特定的加载器，或者想要替换掉特定加载器的实现，可以对其先进行反注册：  

```ts
resource.unregister('Image');
```
