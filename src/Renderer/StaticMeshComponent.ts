/**
 * @File   : StaticMeshComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午6:01:01
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import {SClass} from '../Core/Decorator';
import PrimitiveComponent, {IPrimitiveComponentState} from '../Renderer/PrimitiveComponent';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';
import Mesh from '../Mesh/Mesh';
import RawShaderMaterial from '../Material/RawShaderMaterial';

/**
 * StaticMeshComponent的初始化参数。
 * 
 * @noInheritDoc
 */
export interface IStaticMeshComponentState extends IPrimitiveComponentState {}

/**
 * 判断一个实例是否为`StaticMeshComponent`。
 */
export function isStaticMeshComponent(value: SObject): value is StaticMeshComponent {
  return (value as StaticMeshComponent).isStaticMeshComponent;
}

/**
 * 判断一个实例是否为`StaticMeshActor`。
 */
export function isStaticMeshActor(value: SObject): value is SceneActor<any, StaticMeshComponent> {
  return isSceneActor(value) && isStaticMeshComponent(value.root);
}

/**
 * 静态Component类，承载纯粹静态的模型。
 * 
 * @template IStateTypes 初始化参数类型，必须继承自[IStaticMeshComponentState](../interfaces/istaticmeshcomponentstate)。
 * @noInheritDoc
 */
@SClass({className: 'StaticMeshComponent'})
export default class StaticMeshComponent<
  IStateTypes extends IStaticMeshComponentState = IStaticMeshComponentState
> extends PrimitiveComponent<IStateTypes> {
  public isStaticMeshComponent: boolean = true;

  protected onCreateMesh(state: IStaticMeshComponentState): Mesh {
    return new Mesh({
      geometry: state ? state.geometry : null,
      material: state ? state.material : null
    });
  }
}
