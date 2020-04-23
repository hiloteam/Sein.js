/**
 * @File   : BSPBoxComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 1:30:26 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import BoxGeometry from '../Geometry/BoxGeometry';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import {IStaticMeshComponentState} from '../Renderer/StaticMeshComponent';
import BSPComponent, {IBSPComponentState} from '../BSP/BSPComponent';
import SObject from '../Core/SObject';

/**
 * `BSPBoxComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IBSPBoxComponentState extends IBSPComponentState {
  /**
   * 立方体宽度。
   */
  width?: number;
  /**
   * 立方体高度。
   */
  height?: number;
  /**
   * 立方体深度。
   */
  depth?: number;
  /**
   * 立方体横向分为几个片段。
   */
  widthSegments?: number;
  /**
   * 立方体纵向分为几个片段。
   */
  heightSegments?: number;
  /**
   * 立方体颈向分为几个片段。
   */
  depthSegments?: number;
}

/**
 * 判断一个实例是否为`BSPBoxComponent`。
 */
export function isBSPBoxComponent(value: SObject): value is BSPBoxComponent {
  return (value as BSPBoxComponent).isBSPBoxComponent;
}

/**
 * 判断一个实例是否为`BSPBoxActor`。
 */
export function isBSPBoxActor(value: SObject): value is SceneActor<any, BSPBoxComponent> {
  return isSceneActor(value) && isBSPBoxComponent(value.root);
}

/**
 * 基础立方体。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPBoxComponent'})
export default class BSPBoxComponent extends BSPComponent<IBSPBoxComponentState> {
  public isBSPBoxComponent: boolean = true;

  protected convertState(initState: IBSPBoxComponentState) {
    const {width, height, depth, widthSegments, heightSegments, depthSegments, ...others} = initState;

    const result = others as IStaticMeshComponentState;
    result.geometry = new BoxGeometry(initState);

    return result;
  }
}
