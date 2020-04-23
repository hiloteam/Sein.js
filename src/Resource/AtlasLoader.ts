/**
 * @File   : AtlasLoader.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/29 下午5:17:54
 * @Description:
 */
import ResourceLoader from '../Resource/ResourceLoader';
import {SClass} from '../Core/Decorator';
import {IResourceEntity, IInstantOptions} from '../types/Resource';
import HTTP from '../Network/HTTP';
import SpriteActor from '../Renderer/SpriteActor';
import AtlasManager from '../Texture/AtlasManager';

/**
 * `AtlasLoader`的资源实体类型。
 */
export interface IAtlasResourceEntity extends IResourceEntity {
  type: 'Atlas';
  result?: AtlasManager;
  /**
   * 是否可跨域
   */
  crossOrigin?: boolean;
  /**
   * 是否是可更新的，如果后续需要在运行时修改图集内容则为true。
   * 
   * @default false
   */
  updatable?: boolean;
}

/**
 * 判断一个实例是否为`AtlasLoader`。
 */
export function isAtlasLoader(value: ResourceLoader): value is AtlasLoader {
  return (value as AtlasLoader).isAtlasLoader;
}

/**
 * `AtlasLoader`的实例化参数类型。
 */
export interface IAtlasInstantOptions extends IInstantOptions {}

/**
 * `AtlasLoader`的实例化结果类型。
 */
export type IAtlasInstantResult = SpriteActor;

/**
 * @hidden
 */
function isBase64(url: string) {
  return /^data:(.+?);base64,/.test(url);
}

/**
 * @hidden
 */
function isAbsolute(url: string) {
  return url[0] === '/' || /^(http|https):\/\//.test(url);
}

/**
 * 图集加载器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'AtlasLoader'})
export default class AtlasLoader extends ResourceLoader<IAtlasResourceEntity> {
  public static EXTENSIONS: string[] = ['.atlas'];

  public isAtlasLoader = true;

  public async load(
    entity: IAtlasResourceEntity,
    callbacks: {
      onLoading(entity: IAtlasResourceEntity, progress: number): void;
      onLoaded(entity: IAtlasResourceEntity): void;
      onError(entity: IAtlasResourceEntity, error: Error): void;
    }
  ) {
    try {
      const {data: meta} = await HTTP.get(entity.url);

      if (!meta) {
        throw new Error(`Load resource error: ${entity.name}`);
      }

      callbacks.onLoading(entity, .1);

      let url = meta.meta.image;

      if (!isAbsolute(url) && !isBase64(url)) {
        const fileName = entity.url.split('/').pop();
        url = `${entity.url.replace(fileName, '')}${meta.meta.image}`;
      }

      const image = document.createElement('img');

      image.onload = () => {
        image.onerror = null;
        image.onabort = null;
        image.onload = null;

        if (entity.canceled) {
          return;
        }

        entity.result = new AtlasManager(
          {
            image,
            frames: meta.frames,
            meta: meta.meta
          },
          entity.updatable || false
        );

        callbacks.onLoaded(entity);
      };

      image.onerror = () => {
        callbacks.onError(entity, new Error(`Error when loading ${entity.name}`));
      };

      image.crossOrigin = (entity.crossOrigin || false) ? 'Anonymous' : '';
      image.src = url;
    } catch (error) {
      callbacks.onError(entity, error);
    }
  }

  /**
   * **尚未实现**。 
   */
  public instantiate(entity: IAtlasResourceEntity, options: IAtlasInstantOptions): IAtlasInstantResult {
    throw new Error('Not implemented !');
  }

  /**
   * 释放资源时将会调用，用于自定义释放逻辑。
   */
  public release(entity: IAtlasResourceEntity) {
    entity.result.destroy();
  }
}
