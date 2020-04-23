/**
 * @File   : DirectionalLightComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 8:07:17 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Hilo3d from '../Core/Hilo3d';
import {Vector3} from '../Core/Math';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';
import LightComponent, {ILightComponentState} from '../Light/LightComponent';

/**
 * 判断一个实例是否为`DirectionalLightComponent`。
 */
export function isDirectionalLightComponent(value: SObject): value is DirectionalLightComponent {
  return (value as DirectionalLightComponent).isDirectionalLightComponent;
}

/**
 * 判断一个实例是否为`DirectionalLightActor`。
 */
export function isDirectionalLightActor(value: SObject): value is SceneActor<any, DirectionalLightComponent> {
  return isSceneActor(value) && isDirectionalLightComponent(value.root);
}

/**
 * `DirectionalLightComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IDirectionalLightComponentState extends ILightComponentState {
  /**
   * 光照方向。
   */
  direction?: Vector3;
}

/**
 * 平行光组件。
 *
 * @noInheritDoc
 */
@SClass({className: 'DirectionalLightComponent'})
export default class DirectionalLightComponent extends LightComponent<IDirectionalLightComponentState> {
  public isDirectionalLightComponent: boolean = true;
  public needUpdateAndDestroy: boolean = false;

  protected _light: Hilo3d.DirectionalLight;

  protected onCreateLight(options: IDirectionalLightComponentState) {
    return new Hilo3d.DirectionalLight(options);
  }

  /**
   * 设置光照方向。
   */
  set direction(value: Vector3) {
    this._light.direction.copy(value);
  }

  /**
   * 获取光照方向。
   */
  get direction() {
    return this._light.direction;
  }
}
