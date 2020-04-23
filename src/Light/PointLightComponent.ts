/**
 * @File   : PointLightComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 8:06:53 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Hilo3d from '../Core/Hilo3d';
import SObject from '../Core/SObject';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import LightComponent, {ILightComponentState} from '../Light/LightComponent';

/**
 * 判断一个实例是否为`PointLightComponent`。
 */
export function isPointLightComponent(value: SObject): value is PointLightComponent {
  return (value as PointLightComponent).isPointLightComponent;
}

/**
 * 判断一个实例是否为`PointLightActor`。
 */
export function isPointLightActor(value: SObject): value is SceneActor<any, PointLightComponent> {
  return isSceneActor(value) && isPointLightComponent(value.root);
}

/**
 * `PointLightComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IPointLightComponentState extends ILightComponentState {
  /**
   * 光照范围，设定此属性会自动计算`constantAttenuation`、`linearAttenuation`和`quadraticAttenuation`。
   */
  range?: number;
  /**
   * 光照固定衰减系数。
   */
  constantAttenuation?: number;
  /**
   * 光照线性衰减系数。
   */
  linearAttenuation?: number;
  /**
   * 光照二次衰减系数。
   */
  quadraticAttenuation?: number;
}

@SClass({className: 'PointLightComponent'})
export default class PointLightComponent extends LightComponent<IPointLightComponentState> {
  public isPointLightComponent: boolean = true;
  public needUpdateAndDestroy: boolean = false;

  protected _light: Hilo3d.PointLight;

  protected onCreateLight(options: IPointLightComponentState) {
    return new Hilo3d.PointLight(options);
  }

  /**
   * 设置光照范围。
   */
  set range(value: number) {
    this._light.range = value;
  }

  /**
   * 获取光照范围。
   */
  get range() {
    return this._light.range;
  }

  /**
   * 设置固定衰减系数。
   */
  set constantAttenuation(value: number) {
    this._light.constantAttenuation = value;
  }

  /**
   * 获取固定衰减系数。
   */
  get constantAttenuation() {
    return this._light.constantAttenuation;
  }

  /**
   * 设置线性衰减系数。
   */
  set linearAttenuation(value: number) {
    this._light.linearAttenuation = value;
  }

  /**
   * 获取线性衰减系数。
   */
  get linearAttenuation() {
    return this._light.linearAttenuation;
  }

  /**
   * 设置二次衰减系数。
   */
  set quadraticAttenuation(value: number) {
    this._light.quadraticAttenuation = value;
  }

  /**
   * 获取二次衰减系数。
   */
  get quadraticAttenuation() {
    return this._light.quadraticAttenuation;
  }
}
