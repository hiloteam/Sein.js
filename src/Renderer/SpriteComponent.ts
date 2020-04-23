/**
 * @File   : SpriteComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 5:25:38 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import {SClass} from '../Core/Decorator';
import Texture from '../Texture/Texture';
import SceneComponent, {ISceneComponentState} from './SceneComponent';
import SpriteMaterial from '../Material/SpriteMaterial';
import {IMaterial} from '../Material/Material';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import {Matrix3} from '../Core/Math';
import SObject from '../Core/SObject';
import AtlasManager from '../Texture/AtlasManager';
import RawShaderMaterial from '../Material/RawShaderMaterial';
import Mesh from '../Mesh/Mesh';
import Game from '../Core/Game';

/**
 * @noInheritDoc
 */
export interface ISpriteComponentState extends ISceneComponentState {
  /**
   * 单纹理精灵。
   */
  texture?: Texture;
  /**
   * 图集管理器。
   */
  atlas?: AtlasManager;
  /**
   * 透明度。
   */
  opacity?: number;
  /**
   * 帧名。
   */
  frameName?: string;
  /**
   * 纹理或图集宽度（像素）。
   */
  width: number;
  /**
   * 纹理或图集高度（像素）。
   */
  height: number;
  /**
   * 是否要开启视椎体裁剪，默认开启。
   * 
   * @default true
   */
  frustumTest?: boolean;
  /**
   * 材质追加属性。
   */
  materialOptions?: IMaterial & {
    alphaMode?: 'BLEND' | 'MASK' | 'OPAQUE';
  };
  /**
   * 是否要开启公告牌模式，默认不开启。
   * 
   * @default false
   */
  isBillboard?: boolean;
  /**
   * 可以传入自定义的材质，但要求继承自`SpriteMaterial`。
   * 
   * @default false
   */
  material?: RawShaderMaterial & {isBillBoard: boolean, game: Game};
}

/**
 * 判断一个实例是否为`SpriteComponent`。
 */
export function isSpriteComponent(value: SObject): value is SpriteComponent {
  return (value as SpriteComponent).isSpriteComponent;
}

/**
 * 判断一个实例是否为`SpriteActor`。
 */
export function isSpriteActor(value: SObject): value is SceneActor<any, SpriteComponent> {
  return isSceneActor(value) && isSpriteComponent(value.root);
}

/**
 * 精灵组件类，是展示2D图元的基本组件。
 * 
 * @noInheritDoc
 */
@SClass({className: 'SpriteComponent'})
export default class SpriteComponent<IStateTypes extends ISpriteComponentState = ISpriteComponentState> extends SceneComponent<IStateTypes> {
  public isSpriteComponent: boolean = true;

  protected _owner: SceneActor;
  protected _mesh: Hilo3d.Mesh;
  protected _atlas: AtlasManager;
  protected _texture: Texture;
  protected _currentFrame: string;
  protected _isBillboard: boolean = false;

  /**
   * 是否开启`Billboard`模式，若开启，则精灵始终面向摄像机。
   */
  get isBillboard() {
    return this._isBillboard;
  }

  /**
   * 是否开启`Billboard`模式，若开启，则精灵始终面向摄像机。
   */
  set isBillboard(value: boolean) {
    this._isBillboard = value;
    this.getMaterial().isBillboard = value;
  }

  /**
   * 获取当前的帧名（图集模式）。
   */
  get currentFrame() {
    return this._currentFrame;
  }
 
  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit(state: IStateTypes) {
    super.onInit(state);

    let texture: Texture;
    const uvMatrix: Matrix3 = new Matrix3();

    if (state.atlas) {
      texture = state.atlas.texture;
      this._atlas = state.atlas;
      uvMatrix.copy(this._atlas.getUVMatrix(state.frameName));
    } else {
      this._texture = texture = state.texture;
    }

    texture.width = texture.origWidth;
    texture.height = texture.origHeight;

    const opacity = state.opacity === undefined ? 1 : state.opacity;

    const geometry = new Hilo3d.PlaneGeometry({width: state.width, height: state.height});
    const material = (state.material || new SpriteMaterial({
      uniforms: {
        u_texture: {value: texture},
        u_uvMatrix: {value: uvMatrix},
        u_opacity: {value: opacity}
      }
    })) as SpriteMaterial;

    if (state.material) {
      material.setUniform('u_texture', texture);
      material.setUniform('u_uvMatrix', uvMatrix);
      material.setUniform('u_opacity', opacity);
    }

    if (state.materialOptions) {
      Object.assign(material, state.materialOptions);
    }
    material.game = this.getGame();

    this._mesh = new Mesh({geometry, material});
    (this._mesh as any).__forceUseParentWorldMatrix = true;

    if (state.frustumTest !== undefined) {
      this._mesh.frustumTest = state.frustumTest;
    }

    this.isBillboard = state.isBillboard || false;

    this._node.addChild(this._mesh);

    const root = this.getRoot<SceneComponent>();
    if (root) {
      root.hiloNode.addChild(this._node);
    }
  }

  /**
   * 获取精灵宽度。
   */
  get width() {
    return this._initState.width;
  }

  /**
   * 获取精灵高度。
   */
  get height() {
    return this._initState.height;
  }

  /**
   * 单纹理下模式下，直接设置纹理。
   */
  set texture(texture: Texture) {
    if (this._texture !== texture) {
      this._texture = texture;
      this._mesh.material.setUniform<Texture>('u_texture', texture);
    }
  }

  /**
   * 单纹理下模式下，直接获取纹理。
   */
  get texture(): Texture {
    return this._texture;
  }

  /**
   * 设置当前图集。
   */
  set atlas(atlas: AtlasManager) {
    if (this._atlas !== atlas) {
      this._atlas = atlas;
      this._mesh.material.setUniform<Texture>('u_texture', atlas.getWholeTexture());
    }
  }

  /**
   * 获取当前图集。
   */
  get atlas(): AtlasManager {
    return this._atlas;
  }

  /**
   * 是否需要视椎体裁剪。
   */
  set frustumTest(frustumTest: boolean) {
    this._mesh.frustumTest = frustumTest;
  }

  /**
   * 是否需要视椎体裁剪。
   */
  get frustumTest() {
    return this._mesh.frustumTest;
  }

  /**
   * 获取材质数据。
   */
  get material(): SpriteMaterial {
    return this._mesh.material as SpriteMaterial;
  }

  /**
   * 获取材质数据。
   */
  public getMaterial<IMaterial extends RawShaderMaterial = SpriteMaterial>(): IMaterial {
    return this._mesh.material as IMaterial;
  }

  /**
   * 仅当图集`atlas`模式下，设置要显示哪一帧。
   */
  public setFrame(name: string): this {
    this._mesh.material.setUniform('u_uvMatrix', this._atlas.getUVMatrix(name));
    this._currentFrame = name;

    return this;
  }

  /**
   * 进行一次预渲染，期间会处理材质预编译、资源预提交等。
   */
  public preRender() {
    const {renderer} = this.getGame();

    renderer.renderMesh(this._mesh);
  }
}
