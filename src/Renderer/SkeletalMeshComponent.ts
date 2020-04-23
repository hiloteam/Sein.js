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
import Mesh from '../Mesh/Mesh';
import SkeletalMesh from '../Mesh/SkeletalMesh';
import RawShaderMaterial from '../Material/RawShaderMaterial';

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
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public cloneSkinningFromHilo(mesh: Hilo3d.SkinedMesh, jointNameMap: {[key: number]: Hilo3d.Node}, index?: number) {
    let m = this._mesh;

    if (this.__multiPrimitive) {
      m = this._list[index];

      if (m.material) {
        delete this._table[(m.material as any).name];
      }
    }

    if (mesh.jointMatTexture) {
      m.jointMatTexture = mesh.jointMatTexture;
    }

    if ((mesh as any).jointMat) {
      (m as any).jointMat = (mesh as any).jointMat.slice();
    }

    m.inverseBindMatrices = [];
    m.jointNames = mesh.jointNames.slice();
    (m as any).jointName = (mesh as any).jointName;
    m.jointNodeList = mesh.jointNodeList.map(({jointName}, i) => {
      m.inverseBindMatrices.push(mesh.inverseBindMatrices[i].clone());
      if (!jointNameMap[jointName]) {
        throwException(
          new Error('An error is occurred when adding joints for SkeletalMeshComponent'),
          this,
          {jointNameMap, jointName}
        );
      }

      return jointNameMap[jointName];
    });
  }
}
