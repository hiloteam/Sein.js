/**
 * @File   : GlTFLoader.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午11:05:50
 * @Description:
 */
import ResourceLoader from '../Resource/ResourceLoader';
import {SClass} from '../Core/Decorator';
import {IResourceEntity, IInstantOptions, IGlTFModel, ESeinNodeType, IGlTFParser} from '../types/Resource';
import Hilo3d from '../Core/Hilo3d';
import {
  IGlTFExtension, SeinNodeExtension, SeinPhysicBodyExtension,
  getDefaultParse, SeinAnimatorExtension, SeinRendererExtension,
  SeinAmbientLightExtension, SeinImageBasedLightingExtension,
  SeinAtlasExtension, SeinSpriteExtension, SeinCustomMaterialExtension, SeinCubeTextureExtension, SeinSkyboxExtension, SeinTextureImproveExtension
} from './GlTFExtensions';
import RawShaderMaterial from '../Material/RawShaderMaterial';
import {MetaSMaterials} from '../Core/MetaTypes';
import Constants from '../Core/Constants';
import SArray from '../DataStructure/SArray';
import SceneActor from '../Renderer/SceneActor';
import addActorsFromGlTF from '../utils/addActorsFromGlTF';
import Debug from '../Debug';
import * as Math from '../Core/Math';

/**
 * `GlTFLoader`的资源实体类型。
 */
export interface IGlTFResourceEntity extends IResourceEntity {
  type: 'GlTF';
  /**
   * 是否要忽略纹理加载错误。
   */
  ignoreTextureError?: boolean;
  /**
   * 是否惰性加载纹理资源。
   * 
   * @default false
   */
  isProgressive?: boolean;
  /**
   * 是否要忽略材质加载错误，通常用于`Sein_customMaterial`的场合。
   */
  ignoreMaterialError?: boolean;
  /**
   * 是否在加载GLB成功后，强制清除原始Buffer（可能会增加少部分峰值内存）。
   */
  forceCreateNewBuffer?: boolean;
  /**
   * 加载后的结果。
   */
  result?: IGlTFModel;
}

/**
 * `GlTFLoader`的实例化参数类型。
 */
export interface IGlTFInstantOptions extends IInstantOptions {
  /**
   * 指定节点路径.
   */
  nodePath?: string[];
  /**
   * 是否需要在实例化后，就强制将实例下的所有材质的shader预编译，并将gl资源提交到GPU。
   * 
   * @default false
   */
  preRender?: boolean;  
}

/**
 * `GlTFLoader`的实例化结果类型。
 */
export type IGlTFInstantResult = SArray<SceneActor>;

/**
 * @hidden
 */
function materialCreator(name: string, metaData: any, json: any, parser: IGlTFParser) {
  if (!metaData || !metaData.extensions || !metaData.extensions['SEIN_customMaterial']) {
    return;
  }

  const {extensions, alphaMode, doubleSided} = metaData;
  const {className, uniforms, cloneForInst, renderOrder} = extensions['SEIN_customMaterial'];

  const MaterialClass = MetaSMaterials[className] as {new(...args: any): RawShaderMaterial};

  if (!MaterialClass) {
    if (parser.ignoreMaterialError) {
      Debug.warn(`ShaderMaterial "${className}" is not existed, Please ensure your material is decorated with 'Sein.SMaterial' !`);
      return;
    } else {
      throw new Error(`ShaderMaterial "${className}" is not existed, Please ensure your material is decorated with 'Sein.SMaterial' !`);
    }
  }

  const options: any = {uniforms: {}, doubleSided, alphaMode, renderOrder};

  if (uniforms) {
    for (const key in uniforms) {
      const {type, value} = uniforms[key];

      let v = null;
      switch (type) {
        case Constants.SAMPLER_2D:
          v = parser.textures[value.index];
          break;
        case Constants.SAMPLER_CUBE:
          v = parser.cubeTextures[value.index];
          break;
        case Constants.FLOAT_VEC2:
        case Constants.INT_VEC2:
          v = new Math.Vector2();
          (v as Math.Vector2).fromArray(value);
          break;
        case Constants.FLOAT_VEC3:
        case Constants.INT_VEC3:
          v = new Math.Vector3();
          (v as Math.Vector3).fromArray(value);
          break;
        case Constants.FLOAT_VEC4:
        case Constants.INT_VEC4:
          v = new Math.Color();
          (v as Math.Color).fromArray(value);
          break;
        case Constants.FLOAT_MAT3:
          v = new Math.Matrix3();
          (v as Math.Matrix3).fromArray(value);
          break;
        case Constants.FLOAT_MAT4:
          v = new Math.Matrix4();
          (v as Math.Matrix4).fromArray(value);
          break;
        default:
          v = uniforms[key].value;
          break;
      }

      options.uniforms[key] = {value: v};
    }
  }

  const material = new MaterialClass(options);

  if (cloneForInst !== undefined) {
    material.cloneForInst = cloneForInst;
  }

  material.initCommonOptions(options, true);

  const {Sein_customMaterial, ...others} = extensions;
  parser.parseExtensions(others, material, {isMaterial: true});

  return material;
}

interface ILoadingEvent {
  detail: {
    url: string;
    total: number;
    loaded: number;
  };
}

/**
 * 判断一个实例是否为`GlTFLoader`。
 */
export function isGlTFLoader(value: ResourceLoader): value is GlTFLoader {
  return (value as GlTFLoader).isGlTFLoader;
}

/**
 * GlTF加载器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'GlTFLoader'})
export default class GlTFLoader extends ResourceLoader<IGlTFResourceEntity> {
  public static FORMATS = ['.gltf', '.glb'];

  protected _cache: {[url: string]: IGlTFModel} = {};
  protected _cacheNames: {[url: string]: string[]} = {};

  /**
   * 注册GlTFLoader的扩展。
   */
  public static REGISTER_EXTENSION(hander: IGlTFExtension) {
    if (!hander.parse) {
      hander.parse = getDefaultParse(hander.name);
    } else {
      const parse = hander.parse;
      hander.parse = (info, parser, entity, options) => {
        getDefaultParse(hander.name);
        return parse(info, parser, entity, options);
      };
    }

    Hilo3d.GLTFParser.registerExtensionHandler(hander.name, hander as any);
  }

  /**
   * 取消注册GlTFLoader的扩展。
   */
  public static UNREGISTER_EXTENSION(hander: IGlTFExtension) {
    Hilo3d.GLTFParser.unregisterExtensionHandler(hander.name);
  }

  /**
   * 获取GlTFLoader的扩展。
   */
  public static GET_EXTENSION_HANDLER(name: string): IGlTFExtension {
    return (Hilo3d.GLTFParser as any).extensionHandlers[name];
  }

  public isGlTFLoader = true;

  public load(
    entity: IGlTFResourceEntity,
    callbacks: {
      onLoading(entity: IGlTFResourceEntity, progress: number): void;
      onLoaded(entity: IGlTFResourceEntity): void;
      onError(entity: IGlTFResourceEntity, error: Error): void;
    }
  ) {
    if (this._cache[entity.url]) {
      this._cacheNames[entity.url].push(entity.name);
      entity.result = this._cache[entity.url];
      callbacks.onLoaded(entity);
      return;
    }

    const loader = new Hilo3d.GLTFLoader();
    (loader as any).game = this.game;

    (loader as any).on('progress', (event: ILoadingEvent) => {
      const {loaded, total} = event.detail;

      if (total > 0) {
        callbacks.onLoading(entity, loaded / total);
      }
    });

    loader.load({
      src: entity.url,
      isProgressive: entity.isProgressive || false,
      customMaterialCreator: materialCreator as any,
      isLoadAllTextures: true,
      ignoreTextureError: entity.ignoreTextureError,
      game: this.game,
      ignoreMaterialError: entity.ignoreMaterialError || false,
      forceCreateNewBuffer: entity.forceCreateNewBuffer || false
    } as any)
    .then(result => {
      entity.result = result as any;
      this._cacheNames[entity.url] = this._cacheNames[entity.url] || [];
      this._cacheNames[entity.url][entity.name] = true;
      this._cache[entity.url] = entity.result;
      callbacks.onLoaded(entity);
    })
    .catch(error => callbacks.onError(entity, error));
  }

  /**
   * 将GlTF资源实例化为Actor或者Component。 
   */
  public instantiate(entity: IGlTFResourceEntity, options: IGlTFInstantOptions): IGlTFInstantResult {
    return addActorsFromGlTF(this.game, entity, options);
  }

  /**
   * 释放资源时将会调用，用于自定义释放逻辑。
   */
  public release(entity: IGlTFResourceEntity) {
    const list = this._cacheNames[entity.url];
    if (!list) {
      return;
    }

    if (list.length > 1) {
      list.splice(list.indexOf(entity.name), 1);
      return;
    }
    
    delete this._cacheNames[entity.url];
    delete this._cache[entity.url];
    entity.result.node.destroy(this.game.renderer, true);
  }

  /**
   * 开发者无需关心。
   * 
   * @hidden
   */
  public static clearCache() {
    (Hilo3d.GLTFLoader as any).clearCache();
  }
}

GlTFLoader.REGISTER_EXTENSION(SeinCubeTextureExtension);
GlTFLoader.REGISTER_EXTENSION(SeinNodeExtension);
GlTFLoader.REGISTER_EXTENSION(SeinPhysicBodyExtension);
GlTFLoader.REGISTER_EXTENSION(SeinAnimatorExtension);
GlTFLoader.REGISTER_EXTENSION(SeinRendererExtension);
GlTFLoader.REGISTER_EXTENSION(SeinAmbientLightExtension);
GlTFLoader.REGISTER_EXTENSION(SeinImageBasedLightingExtension);
GlTFLoader.REGISTER_EXTENSION(SeinAtlasExtension);
GlTFLoader.REGISTER_EXTENSION(SeinSpriteExtension);
GlTFLoader.REGISTER_EXTENSION(SeinCustomMaterialExtension);
GlTFLoader.REGISTER_EXTENSION(SeinSkyboxExtension);
GlTFLoader.REGISTER_EXTENSION(SeinTextureImproveExtension);
