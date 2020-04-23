/**
 * @File   : PrimitiveComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/21/2018, 5:25:25 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Material from '../Material/Material';
import Geometry from '../Geometry/Geometry';
import ISceneActor from '../Renderer/ISceneActor';
import {isSceneActor} from '../Renderer/SceneActor';
import SceneComponent, {ISceneComponentState} from './SceneComponent';
import SObject from '../Core/SObject';
import Mesh from '../Mesh/Mesh';
import Hilo3d from '../Core/Hilo3d';
import RawShaderMaterial from '../Material/RawShaderMaterial';

/**
 * `PrimitiveComponent`初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IPrimitiveComponentState extends ISceneComponentState {
  /**
   * 图元材质。
   */
  material?: Material;
  /**
   * 图元几何体。
   */
  geometry?: Geometry;
  /**
   * 是否要开启视椎体裁剪，默认开启。
   * 
   * @default true
   */
  frustumTest?: boolean;
  /**
   * **不要自己传！**
   * 
   * @hidden
   */
  // __doNotUseMultiPrimitiveYourself?: number;
  __doNotUseMultiPrimitiveYourself?: {geometry: Geometry, material: Material}[];
}

/**
 * 判断一个实例是否为`PrimitiveComponent`。
 */
export function isPrimitiveComponent(value: SObject): value is PrimitiveComponent {
  return (value as PrimitiveComponent).isPrimitiveComponent;
}

/**
 * 判断一个实例是否为`PrimitiveActor`。
 */
export function isPrimitiveActor(value: SObject): value is ISceneActor<any, PrimitiveComponent> {
  return isSceneActor(value) && isPrimitiveComponent(value.root);
}

/**
 * 图元Component类，是拥有图元的组件的基类。
 * 这个Component拥有将Mesh添加到World中的能力，基本等同于模型，但一般不直接使用，而是使用其派生的类。
 * 
 * @template IStateTypes 初始化参数类型，必须继承自[IPrimitiveComponentState](../interfaces/iprimitivecomponentstate)。
 * @noInheritDoc
 */
@SClass({className: 'PrimitiveComponent'})
export default class PrimitiveComponent<
  IStateTypes extends IPrimitiveComponentState = IPrimitiveComponentState
> extends SceneComponent<IStateTypes> {
  public isPrimitiveComponent: boolean = true;
  public needUpdateAndDestroy: boolean = false;

  protected _owner: ISceneActor;
  protected _mesh: Mesh;
  protected _list: Mesh[];
  protected _table: {[materialName: string]: Mesh};

  protected __multiPrimitive: boolean = false;

  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit(state: IStateTypes) {
    super.onInit(state);
    this.__multiPrimitive = state.__doNotUseMultiPrimitiveYourself && state.__doNotUseMultiPrimitiveYourself.length > 1;

    if (state.material && (state.material as RawShaderMaterial).cloneForInst) {
      state.material = state.material.clone();
    }
    const defaultMesh = this._mesh = this.onCreateMesh(state);
    (this._mesh as any).__forceUseParentWorldMatrix = true;

    if (this.__multiPrimitive) {
      this._list = [];
      this._table = {};

      const length = state.__doNotUseMultiPrimitiveYourself.length;

      for (let index = 0; index < length; index += 1) {
        const {geometry, material} = state.__doNotUseMultiPrimitiveYourself[index];
        const mesh = index === 0 ? defaultMesh : this.onCreateMesh({
          geometry,
          material: (material as RawShaderMaterial).cloneForInst ? material.clone() : material
        } as IStateTypes);
        (mesh as any).__forceUseParentWorldMatrix = false;
        this._list.push(mesh);
        this._table[(material as any).name] = mesh;

        if (state.frustumTest !== undefined) {
          mesh.frustumTest = state.frustumTest;
        }

        this._node.addChild(mesh);
      }
    } else {
      if (state.frustumTest !== undefined) {
        this._mesh.frustumTest = state.frustumTest;
      }

      this._node.addChild(this._mesh);
    }

    const root = this.getRoot<SceneComponent>();
    if (root) {
      root.hiloNode.addChild(this._node);
    }
  }

  /**
   * 设置材质。
   */
  set material(material: Material) {
    this._mesh.material = material;
  }

  /**
   * 获取材质实例引用。
   */
  get material() {
    return this._mesh.material;
  }

  /**
   * 当GlTF模型数据中一个Mesh拥有多个Primitive时（对应Unity中一个GameObject拥有多个材质测场景），为了进行对应，一个PrimitiveComponent可能拥有多个Mesh。
   * 这种状况时，你可以通过`materialName`来修改一个具体的材质。**但不提供自行创建这种特殊组件的方式，谨慎使用！务必清楚多材质Mesh等价于多个Mesh！**
   */
  public setMaterial(value: Material, materialName?: string): this {
    if (!this.__multiPrimitive) {
      this._mesh.material = value;
      return this;
    }

    if (materialName && this._table[materialName]) {
      this._table[materialName].material = value;
    }

    return this;
  }

  /**
   * 当GlTF模型数据中一个Mesh拥有多个Primitive时（对应Unity中一个GameObject拥有多个材质测场景），为了进行对应，一个PrimitiveComponent可能拥有多个Mesh。
   * 这种状况时，你可以通过`materialName`来获取一个具体的材质。**但不提供自行创建这种特殊组件的方式，谨慎使用！务必清楚多材质Mesh等价于多个Mesh！**
   */
  public getMaterial<IMaterial extends Material>(materialName?: string): IMaterial {
    if (!materialName || !this.__multiPrimitive) {
      return this._mesh.material as IMaterial;
    }

    if (this._table[materialName]) {
      return this._table[materialName].material as IMaterial;
    }

    return null;
  }

  /**
   * 当GlTF模型数据中一个Mesh拥有多个Primitive时（对应Unity中一个GameObject拥有多个材质测场景），为了进行对应，一个PrimitiveComponent可能拥有多个Mesh。
   * 这种状况时，你可以通过此方法获取所有材质。**但不提供自行创建这种特殊组件的方式，谨慎使用！务必清楚多材质Mesh等价于多个Mesh！**
   */
  public getMaterials<IMaterial extends Material>(): IMaterial[] {
    return (!this.__multiPrimitive ? [this.material] : this._list.map(mesh => mesh.material)) as IMaterial[];
  }

  /**
   * 获取几何体实例引用。
   */
  set geometry(geometry: Geometry) {
    this._mesh.geometry = geometry;
  }

  /**
   * 设置几何体实例引用。
   */
  get geometry() {
    return this._mesh.geometry;
  }

  /**
   * 适用于多图元（材质）Mesh，详细基本等同于`setMaterial`方法。
   */
  public setGeometry(value: Geometry, materialName?: string): this {
    if (!this.__multiPrimitive) {
      this._mesh.geometry = value;

      return this;
    }

    if (materialName && this._table[materialName]) {
      this._table[materialName].geometry = value;
    }

    return this;
  }

  /**
   * 适用于多图元（材质）Mesh，详细基本等同于`getMaterial`方法。
   */
  public getGeometry<IGeometry extends Geometry>(materialName?: string): IGeometry {
    if (!materialName || !this.__multiPrimitive) {
      return this._mesh.geometry as IGeometry;
    }

    if (this._table[materialName]) {
      return this._table[materialName].geometry as IGeometry;
    }

    return null;
  }

  /**
   * 适用于多图元（材质）Mesh。
   */
  public getSubMesh(materialName?: string): Mesh {
    if (!materialName || !this.__multiPrimitive) {
      return this._mesh;
    }

    if (this._table[materialName]) {
      return this._table[materialName];
    }

    return null;
  }

  /**
   * 是否需要视椎体裁剪。
   */
  set frustumTest(value: boolean) {
    this.setMeshProperty('frustumTest', value);
  }

  /**
   * 是否需要视椎体裁剪。
   */
  get frustumTest() {
    return this._mesh.frustumTest;
  }

  /**
   * 进行一次预渲染，期间会处理材质预编译、资源预提交等。
   */
  public preRender() {
    const {renderer} = this.getGame();

    if (this.__multiPrimitive) {
      renderer.renderMesh(this._mesh);
      return;
    }

    this._list.forEach(mesh => {
      renderer.renderMesh(mesh);
    });
  }

  protected setMeshProperty(name: string, value: any) {
    if (this.__multiPrimitive) {
      const length = this._list.length;

      for (let index = 0; index < length; index += 1) {
        this._list[index][name] = value;
      }

      return;
    }

    this._mesh[name] = value;
  }

  protected onCreateMesh(state: IStateTypes): Mesh {
    return null;
  }
}
