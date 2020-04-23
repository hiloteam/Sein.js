/**
 * @File   : BSPCylinderComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/13/2018, 2:56:41 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import CylinderGeometry, {ICylinderGeometryOptions} from '../Geometry/CylinderGeometry';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import {IStaticMeshComponentState} from '../Renderer/StaticMeshComponent';
import BSPComponent, {IBSPComponentState} from '../BSP/BSPComponent';
import SObject from '../Core/SObject';

/**
 * `BSPCylinderComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IBSPCylinderComponentState extends IBSPComponentState, ICylinderGeometryOptions {}

/**
 * 判断一个实例是否为`BSPCylinderComponent`。
 */
export function isBSPCylinderComponent(value: SObject): value is BSPCylinderComponent {
  return (value as BSPCylinderComponent).isBSPCylinderComponent;
}

/**
 * 判断一个实例是否为`BSPCylinderActor`。
 */
export function isBSPCylinderActor(value: SObject): value is SceneActor<any, BSPCylinderComponent> {
  return isSceneActor(value) && isBSPCylinderComponent(value.root);
}

/**
 * 基础圆柱体。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPCylinderComponent'})
export default class BSPCylinderComponent extends BSPComponent<IBSPCylinderComponentState> {
  public isBSPCylinderComponent: boolean = true;

  protected convertState(
    initState: IBSPCylinderComponentState
  ): IStaticMeshComponentState {
    const {
      radiusTop, radiusBottom, height, radialSegments, heightSegments,
      openEnded, thetaStart, thetaLength,
      ...others
    } = initState;

    const result = others as IStaticMeshComponentState;
    result.geometry = new CylinderGeometry(initState);

    return result;
  }
}
