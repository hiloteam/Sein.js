/**
 * @File   : BSPPlaneComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 1:30:56 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import PlaneGeometry from '../Geometry/PlaneGeometry';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import {IStaticMeshComponentState} from '../Renderer/StaticMeshComponent';
import BSPComponent, {IBSPComponentState} from '../BSP/BSPComponent';
import SObject from '../Core/SObject';

/**
 * `BSPPlaneComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IBSPPlaneComponentState extends IBSPComponentState {
  /**
   * 平面宽度。
   */
  width?: number;
  /**
   * 平面高度。
   */
  height?: number;
  /**
   * 平面横向分为几个片段。
   */
  widthSegments?: number;
  /**
   * 平面纵向分为几个片段。
   */
  heightSegments?: number;
}

/**
 * 判断一个实例是否为`BSPPlaneComponent`。
 */
export function isBSPPlaneComponent(value: SObject): value is BSPPlaneComponent {
  return (value as BSPPlaneComponent).isBSPPlaneComponent;
}

/**
 * 判断一个实例是否为`BSPPlaneActor`。
 */
export function isBSPPlaneActor(value: SObject): value is SceneActor<any, BSPPlaneComponent> {
  return isSceneActor(value) && isBSPPlaneComponent(value.root);
}

/**
 * 基础平面。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPPlaneComponent'})
export default class BSPPlaneComponent extends BSPComponent<IBSPPlaneComponentState> {
  public isBSPPlaneComponent: boolean = true;

  protected convertState(
    initState: IBSPPlaneComponentState 
  ): IStaticMeshComponentState {
    const {width, height, widthSegments, heightSegments, ...others} = initState;

    const result = others as IStaticMeshComponentState;
    result.geometry = new PlaneGeometry(initState);

    return result;
  }
}
