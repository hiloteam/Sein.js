/**
 * @File   : BSPComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 3:30:06 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import StaticMeshComponent, {IStaticMeshComponentState} from '../Renderer/StaticMeshComponent';
import SObject from '../Core/SObject';

/**
 * `BSPComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IBSPComponentState extends IStaticMeshComponentState {}

/**
 * 判断一个实例是否为`BSPComponent`。
 */
export function isBSPComponent(value: SObject): value is BSPComponent {
  return (value as BSPComponent).isBSPComponent;
}

/**
 * 判断一个实例是否为`BSPActor`。
 */
export function isBSPActor(value: SObject): value is SceneActor<any, BSPComponent> {
  return isSceneActor(value) && isBSPComponent(value.root);
}

/**
 * 基础几何体基类，一般不直接使用，而是使用派生类。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPComponent'})
export default class BSPComponent<
  IGeometryTypes extends IBSPComponentState = IBSPComponentState
> extends StaticMeshComponent<IGeometryTypes> {
  public isBSPComponent: boolean = true;
  public needUpdateAndDestroy: boolean = false;

  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit(initState: IGeometryTypes) {
    const state = this.convertState(initState);

    super.onInit(state);
  }

  protected convertState(initState: IGeometryTypes) {
    return initState;
  }
}
