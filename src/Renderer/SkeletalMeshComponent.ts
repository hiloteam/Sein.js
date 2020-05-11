/**
 * @File   : SkeletalMeshComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/9/2018, 11:48:20 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import {SClass} from '../Core/Decorator';
import PrimitiveComponent, {IPrimitiveComponentState} from '../Renderer/PrimitiveComponent';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';
import throwException from '../Exception/throwException';
import Mesh, { isMesh } from '../Mesh/Mesh';
import SkeletalMesh from '../Mesh/SkeletalMesh';
import RawShaderMaterial from '../Material/RawShaderMaterial';
import BreakGuardException from '../Exception/BreakGuardException';

/**
 * SkeletalMeshComponent的初始化参数。
 * 
 * @noInheritDoc
 */
export interface ISkeletalMeshComponentState extends IPrimitiveComponentState {}

/**
 * 判断一个实例是否为`SkeletalMeshComponent`。
 */
export function isSkeletalMeshComponent(value: SObject): value is SkeletalMeshComponent {
  return (value as SkeletalMeshComponent).isSkeletalMeshComponent;
}

/**
 * 判断一个实例是否为`SkeletalMeshActor`。
 */
export function isSkeletalMeshActor(value: SObject): value is SceneActor<any, SkeletalMeshComponent> {
  return isSceneActor(value) && isSkeletalMeshComponent(value.root);
}

/**
 * 骨架Component类，是拥有骨架的图元组件。
 * 此Component在图元基础之上添加了骨骼动画的能力，拥有骨骼动画的模型实例化后即为此类的实例。
 * 
 * @template IStateTypes 初始化参数类型，必须继承自[ISkeletalMeshComponentState](../interfaces/iskeletalmeshcomponentstate)。
 * @noInheritDoc
 */
@SClass({className: 'SkeletalMeshComponent'})
export default class SkeletalMeshComponent<
  IStateTypes extends ISkeletalMeshComponentState = ISkeletalMeshComponentState
> extends PrimitiveComponent<IStateTypes> {
  public isSkeletalMeshComponent: boolean = true;

  protected _mesh: SkeletalMesh;
  protected _list: SkeletalMesh[];
  protected _table: {[materialName: string]: SkeletalMesh};

  protected onCreateMesh(state: ISkeletalMeshComponentState): Mesh {
    return new SkeletalMesh({
      geometry: state ? state.geometry : null,
      material: state ? state.material : null
    });
  }

  /**
   * 将一个`SkeletalMeshComponent`的骨架赋予到本组件上，通常用于换装。
   */
  public changeSkeleton(component: SkeletalMeshComponent) {
    if (this.__multiPrimitive) {
      this._list.forEach(m => {
        m.skeleton = component._mesh.skeleton;
      });
    } else {
      this._mesh.skeleton = component._mesh.skeleton;
    }
  }

  /**
   * 修改本组件的蒙皮信息，通常用于换装。
   */
  public changeSkin(mesh: Mesh): void;
  public changeSkin(meshes: Mesh[]): void;
  public changeSkin(param: Mesh | Mesh[]) {
    if (isMesh(param)) {
      this._list = null;
      this._table = null;
      this.__multiPrimitive = false;
      this._mesh.geometry = param.geometry;
      this._mesh.material = param.material;
      this._node.children = [this._mesh];

      return;
    }

    if (param.length < 2) {
      throwException(new BreakGuardException(this, `meshes which is array must have more than two elements, if one, please use changeSkin(mesh)`), this);
      return;
    }

    const {skeleton} = this._mesh;
    this._node.children = [];
    this._table = {};
    this._list = param.map(({geometry, material}) => {
      const mesh = new SkeletalMesh({geometry, material: (material as RawShaderMaterial).cloneForInst ? material.clone() : material, skeleton});
      this._table[material.name] = mesh;
      this._node.addChild(mesh);

      return mesh;
    });

    this._mesh = this._list[0];
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public cloneSkinningFromHilo(mesh: Hilo3d.SkinedMesh, index?: number) {
    let m = this._mesh;

    if (this.__multiPrimitive) {
      m = this._list[index];

      if (m.material) {
        delete this._table[(m.material as any).name];
      }
    }

    m.skeleton = mesh.skeleton.clone(this.getRoot<PrimitiveComponent>().hiloNode);
  }
}
