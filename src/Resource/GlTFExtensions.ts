/**
 * @File   : GlTFExtensions.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/8/2018, 3:10:37 PM
 * @Description:
 */
import Game from '../Core/Game';
import SName from '../Core/SName';
import Hilo3d from '../Core/Hilo3d';
import {
  ISeinNodeExtension, INodeWithGlTFExtensions,
  ISeinPhysicBodyExtension, ISeinBoxColliderExtension, ISeinSphereColliderExtension,
  ISeinRendererExtension, ISeinRendererGlobalExtension, ISeinAmbientLightExtension,
  ISeinImageBasedLightingExtension, ISeinImageBasedLightingSourceExtension, ISeinImageBasedLight,
  IGlTFParser, IGlTFModel, ISeinAtlasExtension, ISeinSpriteExtension, ISeinSpriteSourceExtension,
  ISeinCustomMaterialSourceExtension, ISeinCubeTextureExtension, ISeinSkyboxExtension, ISeinTextureImproveExtension
} from '../types/Resource';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SceneComponent from '../Renderer/SceneComponent';
import RigidBodyComponent from '../Physic/RigidBodyComponent';
import BoxColliderComponent from '../Physic/BoxColliderComponent';
import SphereColliderComponent from '../Physic/SphereColliderComponent';
import Debug from '../Debug';
import Constants from '../Core/Constants';
import RawShaderMaterial, {isRawShaderMaterial} from '../Material/RawShaderMaterial';
import {isStaticMeshComponent} from '../Renderer/StaticMeshComponent';
import {isPrimitiveComponent} from '../Renderer/PrimitiveComponent';
import PBRMaterial, {isPBRMaterial} from '../Material/PBRMaterial';
import {Matrix3, Color, SphericalHarmonics3} from '../Core/Math';
import CubeTexture from '../Texture/CubeTexture';
import CubeTextureLoader from './CubeTextureLoader';
import * as Math from '../Core/Math';
import Texture from '../Texture/Texture';
import AtlasManager from '../Texture/AtlasManager';
import ImageLoader from '../Resource/ImageLoader';
import SkyboxMaterial from '../Material/SkyboxMaterial';
import TextureLoader from './TextureLoader';
import LazyTexture from '../Texture/LazyTexture';
import Material from '../Material/Material';

/**
 * GlTF扩展的接口类型。
 * 
 * @member name 扩展的名字，比如`Sein_node`。
 * @member init 文件初始化时，遇到该扩展或执行的方法。
 * @member parseOnLoad 文件解析时，遇到全局扩展时将会执行的方法，此时资源可能没有加载完毕。
 * @member parseOnEnd 文件解析时，遇到全局扩展时将会执行的方法，此时资源均已加载完毕。
 * @member parse 文件解析时，遇到该扩展时将会执行的方法。如果没有将有默认逻辑，将该扩展的属性保存下来，直接传递给在`instantiate`中的`info`。
 * @member instantiate 某个节点实例化结束后，遇到该扩展时将会执行的方法。
 */
export interface IGlTFExtension<IExtensionInfo = any> {
  name: string;
  init?(loader: {game: Game}, parser: IGlTFParser): any;
  parseOnLoad?(info: IExtensionInfo, parser: IGlTFParser): any;
  parseOnEnd?(info: IExtensionInfo, parser: IGlTFParser, model: IGlTFModel): any;
  parse?(info: IExtensionInfo, parser: IGlTFParser, result: any, options?: any): any;
  instantiate?(entity: SceneActor | SceneComponent, info: IExtensionInfo, game: Game, node: INodeWithGlTFExtensions, resource: IGlTFModel): void;
  [key: string]: any;
}

/**
 * @hidden
 */
export const getDefaultParse = (name: string) => (info: ISeinNodeExtension, parser: IGlTFParser, node: INodeWithGlTFExtensions) => {
  if (node) {
    node.gltfExtensions = node.gltfExtensions || {};
    node.gltfExtensions[name] = info;

    return node;
  }
};

/**
 * 模型解压缩扩展的配置实例。
 */
export const AliAMCExtension = (Hilo3d as any).AliAMCExtension as {
  /**
   * Worker的路径，支持相对路径。
   */
  workerURL: string;
  /**
   * 是否强制使用WASM。
   */
  useWASM: boolean;
  /**
   * 是否强制使用Worker。
   */
  useWebWorker: boolean;
  /**
   * 是否自动判断是否使用。
   */
  useAuto: boolean;
  /**
   * 解压时间统计。
   */
  _decodeTotalTime: number;
  /**
   * 手动释放解压需要内存。
   */
  freeMemory(): void;
};

/**
 * @hidden
 */
export const SeinNodeExtension: IGlTFExtension<ISeinNodeExtension> = {
  name: 'Sein_node',
  optionParsers: {},
  registerOptionParsers(type: string, parser: (value: any, parser: IGlTFParser, info: ISeinNodeExtension) => any) {
    SeinNodeExtension.optionParsers[type] = parser;
  },
  unregisterOptionParsers(type: string) {
    delete SeinNodeExtension.optionParsers[type];
  },
  parseOption(option: any, parser: IGlTFParser, info: ISeinNodeExtension) {
    const {type, value} = option;
    if (type && SeinNodeExtension.optionParsers[type]) {
      return SeinNodeExtension.optionParsers[type](value, parser, info);
    }
    else {
      throw new Error(`You must register parser for type '${type}' in Sein_node.initOptions !`);
    }
  },
  parse(info: ISeinNodeExtension, parser: IGlTFParser, node: INodeWithGlTFExtensions, options?: any) {
    node.gltfExtensions = node.gltfExtensions || {};
    node.gltfExtensions[SeinNodeExtension.name] = info;

    if (!info.initOptions) {
      return node;
    }
    
    const initOptions = info.initOptions;
    Object.keys(initOptions).forEach(name => {
      initOptions[name] = SeinNodeExtension.parseOption(initOptions[name], parser, info);
    });

    return node;
  },
  instantiate(entity: SceneActor | SceneComponent, info: ISeinNodeExtension) {
    if (info.updateOnEverTick !== undefined) {
      entity.updateOnEverTick = info.updateOnEverTick;
    }

    if (info.neverTransform !== undefined) {
      entity.isStatic = info.neverTransform;
    }

    if (isSceneActor(entity)) {
      if (info.tag) {
        entity.tag = new SName(info.tag);
      }

      if (info.layers) {
        entity.layers.set(info.layers);
      }

      if (info.persistent !== undefined) {
        entity.persistent = info.persistent;
      }

      if (info.emitComponentsDestroy !== undefined) {
        entity.emitComponentsDestroy = info.emitComponentsDestroy;
      }
    }
  }
};

['Float', 'Int', 'String', 'Bool'].forEach(type => {
  SeinNodeExtension.registerOptionParsers(type, (value: any) => value)
});
SeinNodeExtension.registerOptionParsers('Vec2', (value: number[]) => new Math.Vector2().fromArray(value));
SeinNodeExtension.registerOptionParsers('Vec3', (value: number[]) => new Math.Vector3().fromArray(value));
SeinNodeExtension.registerOptionParsers('Vec4', (value: number[]) => new Math.Vector4().fromArray(value));
SeinNodeExtension.registerOptionParsers('Mat4', (value: number[]) => new Math.Matrix4().fromArray(value));
SeinNodeExtension.registerOptionParsers('Quat', (value: number[]) => new Math.Quaternion().fromArray(value));
SeinNodeExtension.registerOptionParsers('Color', (value: number[]) => new Math.Color().fromArray(value));
SeinNodeExtension.registerOptionParsers('Tex2D', (value: {index: number}, parser: IGlTFParser) => parser.textures[value.index]);
SeinNodeExtension.registerOptionParsers('TexCube', (value: {index: number}, parser: IGlTFParser) => parser.cubeTextures[value.index]);
SeinNodeExtension.registerOptionParsers('Atlas', (value: {index: number}, parser: IGlTFParser) => parser.atlases[value.index]);
SeinNodeExtension.registerOptionParsers('Mat', (value: {index: number}, parser: IGlTFParser) => parser.materials[value.index]);
SeinNodeExtension.registerOptionParsers('Array', (value: any[], parser: IGlTFParser, info: ISeinNodeExtension) => {
  return value.map(v => SeinNodeExtension.parseOption(v, parser, info))
});
SeinNodeExtension.registerOptionParsers('Object', (value: Object, parser: IGlTFParser, info: ISeinNodeExtension) => {
  const result: any = {};

  Object.keys(value).forEach(name => {
    result[name] = SeinNodeExtension.parseOption(value[name], parser, info);
  });

  return result;
});

/**
 * @hidden
 */
export const SeinPhysicBodyExtension: IGlTFExtension<ISeinPhysicBodyExtension> = {
  name: 'Sein_physicBody',
  instantiate(entity: SceneActor | SceneComponent, info: ISeinPhysicBodyExtension, game: Game) {
    if (!isSceneActor(entity)) {
      Debug.warn(`You could not add physicBody to a component: ${entity.name}, ignore...`);
      return;
    }

    const physicBody = info;

    if (!game.world.physicWorld) {
      Debug.warn(`Model ${entity.name} in gltf file has physicBody, but "PhysicWorld" is not found in current world, ignore...`);
      return;
    }

    const body = entity.addComponent('rigidBody', RigidBodyComponent, {
      mass: physicBody.mass,
      friction: physicBody.friction,
      restitution: physicBody.restitution,
      unControl: physicBody.unControl,
      physicStatic: physicBody.physicStatic
    });

    if (info.sleeping) {
      entity.rigidBody.sleep();
    }

    physicBody.colliders.forEach((collider, index) => {
      const name = `collider-${collider.name || (collider.type + index)}`;

      switch (collider.type) {
        case 'BOX':
          entity.addComponent(name, BoxColliderComponent, collider as ISeinBoxColliderExtension);
          break;
        case 'SPHERE':
          entity.addComponent(name, SphereColliderComponent, collider as ISeinSphereColliderExtension);
          break;
        default:
          break;
      }
    });

    if (physicBody.colliders.length) {
      body.forceSync();
    }
  }
};

/**
 * @hidden
 */
export const SeinAnimatorExtension: IGlTFExtension<ISeinNodeExtension> = {
  name: 'Sein_animator',
  instantiate(entity: SceneActor | SceneComponent) {
    if (!isSceneActor(entity)) {
      Debug.warn(`You could not add animator to a component: ${entity.name}, ignore...`);
      return;
    }
  }
};

/**
 * @hidden
 */
export const SeinRendererExtension: IGlTFExtension<ISeinRendererExtension> = {
  name: 'Sein_renderer',
  parseOnLoad(info, parser: IGlTFParser) {
    parser['renderer'] = parser.json.extensions.Sein_renderer || {};
  },
  parseOnEnd(info, parser: IGlTFParser, model: IGlTFModel) {
    model['renderer'] = parser['renderer'];

    return model;
  },
  instantiate(entity: SceneActor | SceneComponent, info: ISeinRendererExtension, _, __, resource: IGlTFModel) {
    const root = isSceneActor(entity) ? entity.root : entity;

    if (!isStaticMeshComponent(root) && !isPrimitiveComponent(root)) {
      return;
    }

    root.getMaterials().forEach(material => {
      if (isStaticMeshComponent(root) && info.lightMap) {
        const matName = (material as any).name;
        material = material.clone();
        root.setMaterial(material, matName);

        const {lightMapIndex, uvChannel, uvRotation, uvScale, uvOffset} = info.lightMap;
        const texture = resource.textures[lightMapIndex];
        texture.uv = uvChannel;

        if (isPBRMaterial(material)) {
          (material as any).lightMap = texture;
        } else if (isRawShaderMaterial(material)) {
          material.setUniform('u_lightMap', texture);
        }

        if (uvChannel === 0) {
          material.uvMatrix = new Matrix3().fromRotationTranslationScale(uvRotation, uvOffset[0], uvOffset[1], uvScale[0], uvScale[1]);
        } else {
          material.uvMatrix1 = new Matrix3().fromRotationTranslationScale(uvRotation, uvOffset[0], uvOffset[1], uvScale[0], uvScale[1]);
        }
      }

      material.receiveShadows = info.castShadows || false;
      material.castShadows = info.receiveShadows || false;
      material.gammaCorrection = info.gammaCorrection || false;

      const globalSetting: ISeinRendererGlobalExtension = resource['renderer'];
      if (globalSetting) {
        material.gammaCorrection = globalSetting.gammaCorrection || false;
        material.useHDR = globalSetting.useHDR || false;
        material.exposure = globalSetting.exposure ? material.exposure : globalSetting.exposure;
      }
    });
  }
};

/**
 * @hidden
 */
export const SeinAmbientLightExtension: IGlTFExtension<ISeinAmbientLightExtension> = {
  name: 'Sein_ambientLight',
  parseOnEnd(info, parser: IGlTFParser, model: IGlTFModel) {
    const {color, intensity} = info;

    const light = new Hilo3d.AmbientLight({
      name: 'gltf-ambientLight-extension',
      color: new Color(color[0], color[1], color[2]),
      amount: intensity
    });

    model['ambientLight'] = light;

    return model;
  }
};

/**
 * @hidden
 */
function getRelativePath(basePath: string, path: string) {
  if (/^(?:http|blob|data:|\/)/.test(path)) {
      return path;
  }
  const basePaths = basePath.replace(/\/[^/]*?$/, '').split('/');
  const paths = path.split('/');

  let i = 0;
  for (i = 0; i < paths.length; i += 1) {
      const p = paths[i];
      if (p === '..') {
        basePaths.pop();
      } else if (p !== '.') {
          break;
      }
  }
  return basePaths.join('/') + '/' + paths.slice(i).join('/');
}

/**
 * @hidden
 */
export const SeinCubeTextureExtension: IGlTFExtension = {
  name: 'Sein_cubeTexture',
  init(_, parser: IGlTFParser) {
    const game: Game = parser.game;
    const actions = [];
    const extensions = parser.json.extensions || {};
    const source: ISeinCubeTextureExtension = extensions.Sein_cubeTexture || {};
    const textures = source.textures || [];
    const cubeTextures: CubeTexture[] = [];
    parser.cubeTextures = cubeTextures;

    textures.forEach((tex, index) => {
      const images: string[] = tex.images.map(imageIndex => {
        let uri = parser.getImageUri(imageIndex);
        uri = getRelativePath(parser.src, uri);
  
        return uri;
      });
  
      actions.push(Promise.resolve().then(() => new Promise((resolve, reject) => {
        const format = /\.png$/.test(images[0]) ? Constants.RGBA : Constants.RGB;
        game.resource.getLoader<CubeTextureLoader>('CubeTexture').load({
          type: 'CubeTexture', url: '', images: {
            right: images[0],
            left: images[1],
            top: images[2],
            bottom: images[3],
            front: images[4],
            back: images[5]
          },
          name: '',
          format: format,
          internalFormat: format,
          isImageCanRelease: tex.isImageCanRelease
        }, {
          onLoading: (_, progress: number) => {},
          onLoaded: entity => {
            const cubeTex = entity.result;
            const sampler = parser.json.samplers[tex.sampler];
            cubeTextures[index] = cubeTex;
            cubeTex.minFilter = sampler.minFilter || cubeTex.minFilter;
            cubeTex.magFilter = sampler.magFilter || cubeTex.magFilter;
            cubeTex.wrapS = sampler.wrapS || cubeTex.wrapS;
            cubeTex.wrapT = sampler.wrapT || cubeTex.wrapT;
            resolve();
          },
          onError: (_, error) => reject(error)
        });
      }))); 
    })

    return Promise.all(actions);
  },
  parseOnEnd(info, parser: IGlTFParser, model: IGlTFModel) {
    model.cubeTextures = parser.cubeTextures;

    return model;
  }
}

/**
 * @hidden
 */
export const SeinImageBasedLightingExtension: IGlTFExtension<ISeinImageBasedLightingExtension> = {
  name: 'Sein_imageBasedLighting',
  init(_, parser: IGlTFParser) {
    const game: Game = parser.game;
    const extensions = parser.json.extensions || {};
    const iblSources: ISeinImageBasedLightingSourceExtension = extensions.Sein_imageBasedLighting || {};
    const lights = iblSources.lights || [];
    const imageBasedLights: ISeinImageBasedLight[] = [];
    parser.imageBasedLights = imageBasedLights;

    lights.forEach((light, index) => {
      imageBasedLights.push({
        diffuse: {
          type: light.diffuse.type,
          intensity: light.diffuse.intensity,
          coefficients: new SphericalHarmonics3().fromArray(light.diffuse.coefficients),
        },
        specular: light.specular ? {
          type: light.specular.type,
          intensity: light.specular.intensity,
          brdfLUTIndex: light.specular.brdfLUT.index,
          brdfLUT: null,
          cubeMap: null
        } : null
      });

      const {specular} = imageBasedLights[index];

      if (!specular) {
        return;
      }

      specular.mapIndex = light.specular.map.index;
    });
  },
  parseOnLoad(info, parser: IGlTFParser) {
    parser.imageBasedLights.forEach(light => {
      if (!light.specular) {
        return;
      }

      light.specular.brdfLUT = parser.textures[light.specular.brdfLUTIndex];
      if (light.specular.type == '2D') {
        light.specular.map = parser.textures[light.specular.mapIndex];
      } else {
        light.specular.map = parser.cubeTextures[light.specular.mapIndex];
      }
    });
  },
  parseOnEnd(info, parser: IGlTFParser, model: IGlTFModel) {
    model.imageBasedLights = parser.imageBasedLights;

    return model;
  },
  parse(info, parser: IGlTFParser, entity: any) {
    // material extension
    const material = entity;
    const {light: lIndex, type} = info;
    const light = parser.imageBasedLights[lIndex] as ISeinImageBasedLight;

    if (isPBRMaterial(material)) {
      // (material as any).isDiffuesEnvAndAmbientLightWorkTogether = true;
      if (type == 'ALL') {
        material.brdfLUT = light.specular.brdfLUT;
        material.specularEnvIntensity = light.specular.intensity;
        material.specularEnvMap = light.specular.map;
      }

      material.diffuseEnvIntensity = light.diffuse.intensity;
      if (light.diffuse.type == 'SH') {
        material.diffuseEnvSphereHarmonics3 = light.diffuse.coefficients;
      } else {
        /**
         * @todo: env map
         */
      }
    } else if (isRawShaderMaterial(material)) {
      /**
       * @todo: support SeinCustomMaterial
       */
      if (type == 'ALL') {
        material.setUniform('u_brdfLUT', light.specular.brdfLUT);
        material.setUniform('u_specularEnvIntensity', light.specular.intensity);
        material.setUniform('u_specularEnvMap', light.specular.map);
      }

      material.setUniform('u_diffuseEnvIntensity', light.diffuse.intensity);
      if (light.diffuse.type == 'SH') {
        material.setUniform('u_diffuseEnvSphereHarmonics3', light.diffuse.coefficients);
      } else {
        /**
         * @todo: env map
         */
      }
    }

    return material;
  }
};

/**
 * @hidden
 */
export const SeinAtlasExtension: IGlTFExtension = {
  name: 'Sein_atlas',
  init(_, parser: IGlTFParser) {
    const game: Game = parser.game;
    const actions = [];
    const extensions = parser.json.extensions || {};
    const ex: ISeinAtlasExtension = extensions.Sein_atlas || {};
    const atlasesSource = ex.atlases || [];
    const atlases: AtlasManager[] = [];
    parser.atlases = atlases;

    atlasesSource.forEach((atlas, index) => {
      atlases.push(null);

      actions.push(Promise.resolve().then(() => new Promise((resolve, reject) => {
        const source = atlas.meta.image.index;
        const uri = parser.getImageUri(source);
        const texture = new LazyTexture() as any;
        texture.uv = undefined;
        texture.crossOrigin = true;
        texture.autoLoad = false;
        (texture as any).resType = parser.getImageType(source);
        texture.src = uri;
        texture.name = atlas.name;
        texture.isImageCanRelease = atlas.isImageCanRelease;

        const OnTextureLoad = (error?: Error) => {
          texture.off('load', OnTextureLoad);
          texture.off('error', OnTextureLoad);

          if (error) {
            return reject(error);
          }

          atlases[index] = new AtlasManager({texture, frames: atlas.frames, meta: atlas.meta}, false);
          atlases[index].name = new SName(atlas.name);
          atlases[index].isImageCanRelease = atlas.isImageCanRelease;
          resolve();
        };

        texture.on('load', () => OnTextureLoad());
        texture.on('error', error => OnTextureLoad(error));

        texture.load(true);
      }))); 
    });

    return Promise.all(actions);
  },
  parseOnEnd(info, parser: IGlTFParser, model: IGlTFModel) {
    model.atlases = parser.atlases;

    return model;
  }
};

/**
 * @hidden
 * 
 * 这里的扩展仅仅是全局用于加载材质脚本的。
 */
export const SeinCustomMaterialExtension: IGlTFExtension = {
  name: 'Sein_customMaterial',
  cache: {},
  init(_, parser: IGlTFParser) {
    const actions = [];
    const extensions = parser.json.extensions || {};
    const ex: ISeinCustomMaterialSourceExtension = extensions.Sein_customMaterial || {};
    const scripts = ex.scripts || [];
    parser.scripts = scripts;

    scripts.forEach((script, index) => {
      let url = script.uri;
      if (SeinCustomMaterialExtension.cache[url]) {
        return;
      }
      SeinCustomMaterialExtension.cache[url] = true;

      url = getRelativePath(parser.src, url);

      actions.push(new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.onload = () => resolve();
        s.onerror = error => reject(error);
        s.src = url;
        document.head.append(s);
      }));
    });

    return Promise.all(actions);
  }
};

/**
 * @hidden
 */
export class FakeHiloSprite extends Hilo3d.Node {
  public className: string = 'FakeHiloSprite';
  public isFakeHiloSprite = true;
  public sprite: ISeinSpriteSourceExtension['sprites'][0];
  public material: Material;
}
/**
 * @hidden
 */
export const SeinSpriteExtension: IGlTFExtension<ISeinSpriteExtension> = {
  name: 'Sein_sprite',
  init(_, parser: IGlTFParser) {
    const extensions = parser.json.extensions || {};
    const ex: ISeinSpriteSourceExtension = extensions.Sein_sprite || {};
    parser.sprites = (ex.sprites || []).map(sprite => {
      const res = new FakeHiloSprite();
      res.sprite = sprite;

      return res;
    });
  },
  parseOnEnd(info: any, parser: IGlTFParser, model: IGlTFModel) {
    model['sprites'] = parser.sprites;
    parser.sprites.forEach(sp => {
      if (sp.sprite.material) {
        sp.material = parser.materials[sp.sprite.material.index];
      }
    });

    return model;
  },
  parse(info: any, parser: IGlTFParser, entity: any) {
    const node = entity;

    node.addChild(parser.sprites[info.index])

    return node;
  }
};

/**
 * @hidden
 */
export const SeinSkyboxExtension: IGlTFExtension<ISeinSkyboxExtension> = {
  name: 'Sein_skybox',
  parse(info: ISeinSkyboxExtension, parser: IGlTFParser, entity: any) {
    const camera = entity;

    const material = new SkyboxMaterial({
      type: info.type,
      uniforms: {
        u_color: {value: new Color().fromArray(info.color)},
        u_factor: {value: info.factor},
        u_texture: info.texture && {value: info.type === 'Panoramic' ? parser.textures[info.texture.index] : parser.cubeTextures[info.texture.index]},
        u_rotation: info.rotation !== undefined && {value: info.rotation},
        u_exposure: info.exposure !== undefined && {value: info.exposure},
        u_degrees: info.degrees !== undefined && {value: info.degrees},
      }
    });

    const globalSetting: ISeinRendererGlobalExtension = parser.renderer;
    if (globalSetting) {
      material.gammaCorrection = globalSetting.gammaCorrection || false;
      material.useHDR = globalSetting.useHDR || false;
      material.exposure = globalSetting.exposure ? material.exposure : globalSetting.exposure;
    }

    camera.backgroundMat = material;

    return camera;
  }
};

/**
 * @hidden
 */
export const SeinTextureImproveExtension: IGlTFExtension<ISeinTextureImproveExtension> = {
  name: 'Sein_textureImprove',
  parse(info: ISeinTextureImproveExtension, parser: IGlTFParser, texture: Texture) {
    texture.isImageCanRelease = info.isImageCanRelease;
    texture.anisotropic = info.anisotropic || texture.anisotropic;
    texture.type = info.textureType || texture.type;

    return texture;
  }
};

/**
 * @hidden
 */
function parse(info, parser: IGlTFParser, material, options) {
  if (options.isGlobalExtension) {
    return null;
  }

  const textures = parser.textures || [];

  const techniqueInfo = parser.techniques[info.technique];
  if (!techniqueInfo) {
    return null;
  }
  const programInfo = parser.programs[techniqueInfo.program];
  if (!programInfo) {
    return null;
  }

  const fragmentText = parser.shaders[programInfo.fragmentShader];
  const vertexText = parser.shaders[programInfo.vertexShader];

  const uniformsInfo = techniqueInfo.uniforms || {};
  const attributesInfo = techniqueInfo.attributes || {};
  const valuesInfo = info.values || {};

  const attributes = {};
  const uniforms = {};

  for (const uniformName in uniformsInfo) {
    const uniformDef = uniformsInfo[uniformName] || {};
    const uniformValue = valuesInfo[uniformName] !== undefined ? valuesInfo[uniformName] : uniformDef.value;
    let uniformObject;
    if (uniformValue !== undefined) {
      if (uniformDef.type === Constants.SAMPLER_2D) {
        const textureIndex = uniformValue.index || 0;
        uniformObject = {value: textures[textureIndex]};
      } else {
        uniformObject = {value: uniformValue};
      }
    } else if (uniformDef.semantic && Hilo3d.semantic[uniformDef.semantic]) {
      // const semanticFunc = Hilo3d.semantic[uniformDef.semantic];
      // const nodeIndex = uniformDef.node;
      // let node;
      // if (nodeIndex !== undefined) {
      //   uniformObject = {
      //     get(mesh, material, programInfo) {
      //       if (node === undefined) {
      //         node = parser.node.getChildByFn((node) => {
      //           return node.animationId === nodeIndex;
      //         }) || mesh;
      //       }
      //       return semanticFunc.get(node, material, programInfo);
      //     }
      //   };
      // } else {
      //   uniformObject = uniformDef.semantic;
      // }
      uniformObject = uniformDef.semantic;
    } else {
      uniformObject = (Hilo3d.semantic as any).blankInfo;
    }
    uniforms[uniformName] = uniformObject;
  }

  for (const attributeName in attributesInfo) {
    const attributeValue = attributesInfo[attributeName] || {};
    if (attributeValue.semantic) {
      attributes[attributeName] = attributeValue.semantic;
    }
  }

  const shaderMaterial = new RawShaderMaterial({
    vs: vertexText,
    fs: fragmentText,
    attributes,
    uniforms
  });

  return shaderMaterial;
}

(Hilo3d as any).GLTFExtensions.KHR_techniques_webgl.parse = parse;
