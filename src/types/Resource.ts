/**
 * @File   : types.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/29 下午7:08:03
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import SceneActor from '../Renderer/SceneActor';
import SceneComponent from '../Renderer/SceneComponent';
import {TConstructor} from './Common';
import ResourceLoadException from '../Exception/ResourceLoadException';
import Mesh from '../Mesh/Mesh';
import Texture from '../Texture/Texture';
import Material from '../Material/Material';
import CubeTexture from '../Texture/CubeTexture';
import {SphericalHarmonics3} from '../Core/Math';
import Game from '../Core/Game';
import AtlasManager from '../Texture/AtlasManager';

/**
 * 资源实体类型，一般用于加载资源时指定的参数。
 */
export interface IResourceEntity {
  /**
   * 资源类型。
   * 
   * 不传则会按照资源加载器本身注册时的后缀查找。
   */
  type?: string;
  /**
   * 资源名称，唯一索引。
   */
  name: string;
  /**
   * 资源在远端的uri。
   * 
   * 可以使用一个函数来返回，以应对更加灵活的场景。
   */
  url: string;
  /**
   * 资源加载的权重，可用于计算进度。
   * 
   * @default 1
   */
  weight?: number;
  /**
   * 资源是否已取消加载的标记，通常用于资源加载器实现取消加载逻辑。
   * 
   * @default false
   * @hidden
   */
  canceled?: boolean;
  /**
   * 资源加载后的结构，根据不同类型有不同结果，交由Loader具体实现。`resource.get<T>`中得到的结果。
   * 
   * @hidden
   */
  result?: any;
  /**
   * **不要自己指定。**
   * 
   * @hidden
   */
  preProgress?: number;
  [key: string]: any;
}

/**
 * 资源加载状态，在`onLoading`声明周期中参数就是它。
 */
export interface IResourceState {
  /**
   * 当批加载的资源总计数。
   */
  totalCount: number;
  /**
   * 当批已经加载的资源计数。
   */
  loadedCount: number;
  /**
   * 当批加载进度。
   */
  progress: number;
  /**
   * 当批总体权重。
   */
  totalWeight: number;
  /**
   * 当批资源是否加载完毕。
   */
  loadDone: boolean;
  /**
   * 当前正在加载的资源实例引用。
   */
  current: IResourceEntity;
  /**
   * 如果有加载错误，将会有值。
   */
  error?: ResourceLoadException;
}

/**
 * GlTF加载器
 */
export interface IGlTFParser {
  /**
   * 当前游戏实例。
   */
  game: Game;
  /**
   * 模型的根节点
   */
  node: Hilo3d.Node;
  /**
   * 模型的所有Mesh对象数组
   */
  meshes: Mesh[];
  /**
   * 模型的动画对象数组，没有动画的话为null
   */
  anim: Hilo3d.Animation;
  /**
   * 模型中的所有Camera对象数组
   */
  cameras: Hilo3d.Camera[];
  /**
   * 模型中的所有Light对象数组
   */
  lights: Hilo3d.Light[];
  /**
   * 模型中的所有Texture对象数组
   */
  textures: Texture[];
  /**
   * 模型中的所有Material对象数组
   */
  materials: Material[];
  /**
   * 模型中的所有CubeTexture对象数组
   */
  cubeTextures: CubeTexture[];
  /**
   * 模型中的所有IBLSource对象数组
   */
  imageBasedLights: ISeinImageBasedLight[];
  /**
   * 模型中的所有图集对象数组
   */
  atlases: AtlasManager[];
  /**
   * 场景的全局渲染配置
   */
  renderer: ISeinRendererGlobalExtension;
  /**
   * 模型的元数据
   */
  json: any;
  /**
   * 可自由添加的临时变量。
   */
  [key: string]: any;
}

/**
 * 资源实例化时的参数类型。
 */
export interface IInstantOptions {
  /**
   * 指定父级Actor实例。当`asComponent`为`true`时，必传。
   * 若指定，则新生成的Actor会作为它的子Actor，或成为Component的Owner。
   */
  parentActor?: SceneActor;

  /**
   * 若资源实例化后是单个Actor，则可以为其指定名字.
   */
  name?: string;
  /**
   * 是否强制资源实例化为Component。
   */
  asComponent?: boolean;
  /**
   * 在`asComponent`为`true`时，可以指定其父级Component。
   */
  parentComponent?: SceneComponent;
  /**
   * 若资源实例化后是单个Actor或Component，则可以为其指定作为容器的类名.
   * 指定的类必须和资源本身类型契合，比如一个静态模型指定的类的根组件就必须自`StaticMeshComponent`。
   * 此方法用于用`SClass`装饰器标注过的类，也可以直接用`Class`指定类。
   */
  className?: string;
  /**
   * 若资源实例化后是单个Actor或Component，则可以为其指定作为容器的类.
   * 指定的类必须和资源本身类型契合，比如一个静态模型指定的类的根组件就必须自`StaticMeshComponent`。
   * 也可直接用`className`指定类名。
   */
  Class?: TConstructor<SceneActor | SceneComponent>;
}

export interface IGlTFModel {
  /**
   * 模型的根节点
   */
  node: Hilo3d.Node;
  /**
   * 模型的所有Mesh对象数组
   */
  meshes: Mesh[];
  /**
   * 模型的动画对象数组，没有动画的话为null
   */
  anim: Hilo3d.Animation;
  /**
   * 模型中的所有Camera对象数组
   */
  cameras: Hilo3d.Camera[];
  /**
   * 模型中的所有Light对象数组
   */
  lights: Hilo3d.Light[];
  /**
   * 模型中的所有Texture对象数组
   */
  textures: Texture[];
  /**
   * 模型中的所有Material对象数组
   */
  materials: Material[];
  /**
   * 模型中的所有CubeTexture对象数组
   */
  cubeTextures: CubeTexture[];
  /**
   * 模型中的所有IBLSource对象数组
   */
  imageBasedLights: ISeinImageBasedLight[];
  /**
   * 模型中的所有图集对象数组
   */
  atlases: AtlasManager[];
  /**
   * 场景的全局渲染配置
   */
  renderer: ISeinRendererGlobalExtension;
  /**
   * 模型的元数据
   */
  json: any;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export enum ESeinNodeType {
  Component = 1,
  Actor = 2
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinNodeExtension {
  selfType?: ESeinNodeType;
  childrenType?: ESeinNodeType;
  tag?: string;
  layers?: number;
  persistent?: boolean;
  emitComponentsDestroy?: boolean;
  updateOnEverTick?: boolean;
  neverTransform?: boolean;
  skipThisNode?: boolean;
  className?: string;
  initOptions?: {
    [name: string]: {
      type: string;
      value: any;
    };
  };
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinBoxColliderExtension {
  name: string;
  isTrigger: boolean;
  type: 'BOX';
  offset: number[];
  size: number[];
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinSphereColliderExtension {
  name: string;
  isTrigger: boolean;
  type: 'SPHERE';
  offset: number[];
  radius: number;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinPhysicBodyExtension {
  mass: number;
  friction: number;
  restitution: number;
  unControl: boolean;
  physicStatic: boolean;
  sleeping: boolean;
  colliders: (ISeinBoxColliderExtension | ISeinSphereColliderExtension)[];
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinAnimatorExtension {
  modelAnimations: string[];
  defaultAnimation: string;
  prefixes: string[];
  prefix?: string;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinRendererGlobalExtension {
  useHDR?: boolean;
  exposure?: number;
  gammaCorrection?: boolean;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinRendererExtension {
  lightMap?: {
    uvChannel: number;
    uvRotation: number;
    uvScale: number[];
    uvOffset: number[];
    lightMapIndex: number;
  };
  castShadows: boolean;
  receiveShadows: boolean;
  /**
   * @deprecated
   * 
   * 移到了全局。
   */
  gammaCorrection?: boolean;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinAmbientLightExtension {
  color: number[];
  intensity: number;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinImageBasedLightingExtension {
  light: number;
  type: 'SPECULAR' | 'ALL';
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinImageBasedLightingSourceExtension {
  lights: {
    diffuse: {
      type: 'SH' | 'MAP';
      intensity: number;
      coefficients: number[][];
    };
    specular: {
      type: 'CUBE' | '2D';
      intensity: number;
      includeMipmaps: boolean;
      brdfLUT: {index: number};
      map: {index: number};
    };
  }[];
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinCubeTextureExtension {
  textures: {
    images: number[];
    sampler: number;
    isImageCanRelease?: boolean;
  }[]
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinAtlasExtension {
  atlases: {
    name: string;
    frames: {[name: string]: {
      frame: {x: number, y: number, w: number, h: number},
    }};
    meta: {
      image: {index: number};
      size: {w: number, h: number};
    };
    isImageCanRelease?: boolean;
  }[];
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinTextureImproveExtension {
  anisotropic?: number;
  isImageCanRelease?: boolean;
  textureType?: number;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinSpriteSourceExtension {
  sprites: {
    width: number;
    height: number;
    atlas: {
      index: number;
      frameName: string;
    },
    isBillboard: boolean;
    frustumTest: boolean;
    material?: {index: number};
  }[];
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinSpriteExtension {
  index: number;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinSkyboxExtension {
  type: 'Cube' | 'Color' | 'Panoramic';
  factor: number;
  color: number[];
  texture?: {index: number};
  rotation?: number;
  exposure?: number;
  degrees?: number;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinImageBasedLight {
  diffuse: {
    type: "SH" | 'MAP';
    intensity: number;
    coefficients: SphericalHarmonics3;
  };
  specular: {
    type: "CUBE" | '2D';
    intensity: number;
    brdfLUTIndex: number;
    brdfLUT: Texture;
    includeMipmaps?: boolean;
    cubeMap?: CubeTexture;
    mapIndex?: number;
    map?: Texture;
  };
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface ISeinCustomMaterialSourceExtension {
  scripts: {
    uri: string;
  }[];
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface INodeGlTFExtensions {
  [name: string]: any;
  Sein_node?: ISeinNodeExtension;
  Sein_physicBody?: ISeinPhysicBodyExtension;
  Sein_animator?: ISeinAnimatorExtension;
  Sein_renderer?: ISeinRendererExtension;
  Sein_ambientLight?: ISeinAmbientLightExtension;
  Sein_sprite?: ISeinSpriteExtension;
}

/**
 * **GlTFLoader的扩展相关，不要自己使用。**
 * 
 * @hidden
 */
export interface INodeWithGlTFExtensions extends Hilo3d.Node {
  gltfExtensions: INodeGlTFExtensions;
}
