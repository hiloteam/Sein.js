/**
 * @File   : ImageLoader.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/28/2018, 4:52:10 PM
 * @Description:
 */
import ResourceLoader from '../Resource/ResourceLoader';
import {SClass} from '../Core/Decorator';
import {IResourceEntity} from '../types/Resource';

/**
 * `ImageLoader`的资源实体类型。
 */
export interface IImageResourceEntity extends IResourceEntity {
  type: 'Image';
  /**
   * 是否要允许资源跨域。
   */
  crossOrigin?: boolean;
  /**
   * 加载后的结果。
   */
  result?: HTMLImageElement;
}

/**
 * 判断一个实例是否为`ImageLoader`。
 */
export function isImageLoader(value: ResourceLoader): value is ImageLoader {
  return (value as ImageLoader).isImageLoader;
}

/**
 * 图片加载器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'ImageLoader'})
export default class ImageLoader extends ResourceLoader<IImageResourceEntity> {
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
      image.onerror = null;
      image.onabort = null;
      image.onload = null;

      if (entity.canceled) {
        return;
      }

      entity.result = image;
      callbacks.onLoaded(entity);
    };

    image.onerror = () => {
      callbacks.onError(entity, new Error(`Error when loading ${entity.url}`));
    };

    image.crossOrigin = (entity.crossOrigin || false) ? 'Anonymous' : '';
    image.src = entity.url;
  }
}
