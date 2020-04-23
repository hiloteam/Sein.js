/**
 * @File   : ResourceLoader.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/14/2018, 5:29:18 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import {IResourceEntity, IInstantOptions} from '../types/Resource';
import Game from '../Core/Game';

/**
 * 判断一个实例是否为`ResourceLoader`。
 */
export function isResourceLoader(value: SObject): value is ResourceLoader {
  return (value as ResourceLoader).isResourceLoader;
}

/**
 * 资源加载器。加载器用于在资源管理器[ResourceManager](../eesourcemanager)注册加载器时。
 * 你可以继承此基类来派生自己的加载器。
 * 
 * @template IResource 此加载器对应的实体参数类型。
 * @noInheritDoc
 */
@SClass({className: 'ResourceLoader'})
export default class ResourceLoader<
  IResource extends IResourceEntity = IResourceEntity,
  IInstant extends IInstantOptions = IInstantOptions
> extends SObject {
  /**
   * 此加载器所关联的后缀，例如`.png`。
   * 
   * 注意后面的会覆盖前面的！
   */
  public static EXTENSIONS: string[] = [];

  public isResourceLoader = true;
  /**
   * @hidden
   */
  public game: Game;

  /**
   * 加载一个资源，并根据情况执行`callbacks`中的回调。
   */
  public load(
    entity: IResource,
    callbacks: {
      onLoading(entity: IResource, progress: number): void;
      onLoaded(entity: IResource): void;
      onError(entity: IResource, error: Error): void;
    }
  ): void {
    setTimeout(() => callbacks.onLoaded(entity), 0);
  }

  /**
   * 取消加载特定实体。一般不需要自己编写逻辑，而是使用`entity.canceled`在加载终点丢弃。
   * 注意`entity.canceled`是在这里赋值的，所以一般继承请务必先执行`super.cancel()`！
   */
  public cancel(entity: IResourceEntity) {
    entity.canceled = true;
  }

  /**
   * 通过指定资源实体实例化出一个具体的对象。
   */
  public instantiate(entity: IResourceEntity, options: IInstant): any {
    throw new Error('Not implemented !');
  }

  /**
   * 释放资源时将会调用，用于自定义释放逻辑。
   */
  public release(entity: IResourceEntity) {

  }
}
