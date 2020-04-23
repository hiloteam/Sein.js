/**
 * @File   : TextureLoader.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 上午11:30:18
 * @Description:
 */
import Texture from '../Texture/Texture';
import ResourceLoader from '../Resource/ResourceLoader';
import {SClass} from '../Core/Decorator';
import {IResourceEntity} from '../types/Resource';
import Hilo3d from '../Core/Hilo3d';

/**
 * `TextureLoader`的资源实体类型。
 */
export interface ITextureResourceEntity extends IResourceEntity {
  type: 'Texture';
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
   * 提交GPU后是否释放CPU内存
   */
  isImageCanRelease?: boolean;
  /**
   * 强制指定是否是HDR格式，若不是则会通过后缀是否为`hdr`自行判断。
   */
  hdr?: boolean;
  /**
   * 强制指定是否是KTX格式，若不是则会通过后缀是否为`ktx`自行判断。
   */
  ktx?: boolean;
  /**
   * 加载后的结果。
   */
  result?: Texture;
}

/**
 * 判断一个实例是否为`TextureLoader`。
 */
export function isTextureLoader(value: ResourceLoader): value is TextureLoader {
  return (value as TextureLoader).isTextureLoader;
}

/**
 * @hidden
 */
const loader = new Hilo3d.TextureLoader();

/**
 * @hidden
 */
const hdrLoader = new (Hilo3d as any).HDRLoader;

/**
 * @hidden
 */
const ktxLoader = new (Hilo3d as any).KTXLoader;

/**
 * 纹理加载器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'TextureLoader'})
export default class TextureLoader extends ResourceLoader<ITextureResourceEntity> {
  public static EXTENSIONS: string[] = ['.png', '.jpg', '.bmp', '.hdr', '.ktx'];

  public isTextureLoader = true;

  public load(
    entity: ITextureResourceEntity,
    callbacks: {
      onLoading(entity: ITextureResourceEntity, progress: number): void;
      onLoaded(entity: ITextureResourceEntity): void;
      onError(entity: ITextureResourceEntity, error: Error): void;
    }
  ): void {
    const realLoader = (entity.hdr || /.hdr$/.test(entity.url)) ? hdrLoader : (entity.ktx || /.ktx$/.test(entity.url)) ? ktxLoader : loader;

    realLoader.load({
      src: entity.url,
      crossOrigin: entity.crossOrigin || false,
      uv: entity.uv || 0,
      flipY: entity.flipY,
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
  public release(entity: ITextureResourceEntity) {
    entity.result.destroy();
  }
}
