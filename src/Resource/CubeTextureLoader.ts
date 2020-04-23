/**
 * @File   : CubeTextureLoader.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/1/2019, 5:32:59 PM
 * @Description:
 */
import Texture from '../Texture/Texture';
import ResourceLoader from '../Resource/ResourceLoader';
import {SClass} from '../Core/Decorator';
import {IResourceEntity} from '../types/Resource';
import Hilo3d from '../Core/Hilo3d';
import CubeTexture from '../Texture/CubeTexture';
import Constants from '../Core/Constants';

/**
 * `CubeTextureLoader`的资源实体类型。
 */
export interface ICubeTextureResourceEntity extends IResourceEntity {
  type: 'CubeTexture';
  /**
   * 指定Cube的六个平面的贴图，将会拼接到`src`后面。
   */
  images: {
    left: string;
    right: string;
    front: string;
    back: string;
    top: string;
    bottom: string;
  };
  /**
   * 是否要允许资源跨域。
   */
  crossOrigin?: boolean;
  /**
   * 指定使用的uv数据。
   */
  uv?: number;
  /**
   * 是否要翻转Y轴。
   */
  flipY?: boolean;
  /**
   * 格式。
   */
  format?: number;
  /**
   * 内部格式。
   */
  internalFormat?: number;
  /**
   * 提交GPU后是否释放CPU内存
   */
  isImageCanRelease?: boolean;
  /**
   * 加载后的结果。
   */
  result?: CubeTexture;
}

/**
 * 判断一个实例是否为`CubeTextureLoader`。
 */
export function isCubeTextureLoader(value: ResourceLoader): value is CubeTextureLoader {
  return (value as CubeTextureLoader).isCubeTextureLoader;
}

/**
 * @hidden
 */
const loader = new Hilo3d.CubeTextureLoader();

/**
 * 纹理加载器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'CubeTextureLoader'})
export default class CubeTextureLoader extends ResourceLoader<ICubeTextureResourceEntity> {
  public isCubeTextureLoader = true;

  public load(
    entity: ICubeTextureResourceEntity,
    callbacks: {
      onLoading(entity: ICubeTextureResourceEntity, progress: number): void;
      onLoaded(entity: ICubeTextureResourceEntity): void;
      onError(entity: ICubeTextureResourceEntity, error: Error): void;
    }
  ): void {
    const {url, images} = entity;
    const baseUrl = (!url || url[url.length - 1] === '/') ? entity.url : entity.url + '/';

    loader.load({
      left: baseUrl + images.left,
      right: baseUrl + images.right,
      front: baseUrl + images.front,
      back: baseUrl + images.back,
      top: baseUrl + images.top,
      bottom: baseUrl + images.bottom,
      crossOrigin: entity.crossOrigin || false,
      uv: entity.uv || 0,
      flipY: entity.flipY,
      format: entity.format || Constants.RGB,
      internalFormat: entity.internalFormat || Constants.RGB,
      isImageCanRelease: entity.isImageCanRelease
    } as any)
    .then(result => {
      entity.result = result;
      callbacks.onLoaded(entity);
    })
    .catch(error => callbacks.onError(entity, error));
  }

  /**
   * 释放资源时将会调用，用于自定义释放逻辑。
   */
  public release(entity: ICubeTextureResourceEntity) {
    entity.result.destroy();
  }
}
