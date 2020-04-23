/**
 * @File   : BSPSphereComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 1:30:46 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SphereGeometry from '../Geometry/SphereGeometry';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import {IStaticMeshComponentState} from '../Renderer/StaticMeshComponent';
import BSPComponent, {IBSPComponentState} from '../BSP/BSPComponent';
import SObject from '../Core/SObject';

/**
 * `BSPSphereComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IBSPSphereComponentState extends IBSPComponentState {
  /**
   * 球体半径。
   */
  radius?: number;
  /**
   * 球体横向分为几个片段。
   */
  widthSegments?: number;
  /**
   * 球体纵向分为几个片段。
   */
  heightSegments?: number;
}

/**
 * 判断一个实例是否为`BSPSphereComponent`。
 */
export function isBSPSphereComponent(value: SObject): value is BSPSphereComponent {
  return (value as BSPSphereComponent).isBSPSphereComponent;
}

/**
 * 判断一个实例是否为`BSPSphereActor`。
 */
export function isBSPSphereActor(value: SObject): value is SceneActor<any, BSPSphereComponent> {
  return isSceneActor(value) && isBSPSphereComponent(value.root);
}

/**
 * 基础球体。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPSphereComponent'})
export default class BSPSphereComponent extends BSPComponent<IBSPSphereComponentState> {
  public isBSPSphereComponent: boolean = true;

  protected convertState(
    initState: IBSPSphereComponentState
  ): IStaticMeshComponentState {
    const {radius, widthSegments, heightSegments, ...others} = initState;

    const result = others as IStaticMeshComponentState;
    result.geometry = new SphereGeometry(initState);

    return result;
  }
}
