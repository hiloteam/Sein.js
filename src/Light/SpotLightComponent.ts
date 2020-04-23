/**
 * @File   : SpotLightComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 8:07:33 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Hilo3d from '../Core/Hilo3d';
import {Vector3} from '../Core/Math';
import {IShadowOptions} from '../types/Renderer';
import SObject from '../Core/SObject';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import LightComponent, {ILightComponentState} from '../Light/LightComponent';

/**
 * 判断一个实例是否为`SpotLightComponent`。
 */
export function isSpotLightComponent(value: SObject): value is SpotLightComponent {
  return (value as SpotLightComponent).isSpotLightComponent;
}

/**
 * 判断一个实例是否为`SpotLightActor`。
 */
export function isSpotLightActor(value: SObject): value is SceneActor<any, SpotLightComponent> {
  return isSceneActor(value) && isSpotLightComponent(value.root);
}

/**
 * `SpotLightComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface ISpotLightComponentState extends ILightComponentState {
  /**
   * 光照方向。
   */
  direction?: Vector3;
  /**
   * 阴影属性。
   */
  shadow?: IShadowOptions;
  /**
   * 内裁剪范围。
   */
  cutoff?: number;
  /**
   * 外裁剪范围。
   */
  outerCutoff?: number;
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

@SClass({className: 'SpotLightComponent'})
export default class SpotLightComponent extends LightComponent<ISpotLightComponentState> {
  public isLightComponent: boolean = true;
  public isSpotLightComponent: boolean = true;
  public needUpdateAndDestroy: boolean = false;

  protected _light: Hilo3d.SpotLight;

  protected onCreateLight(options: ISpotLightComponentState) {
    return new Hilo3d.SpotLight(options);
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
   * 设置内裁剪范围。
   */
  set cutoff(value: number) {
    this._light.cutoff = value;
  }

  /**
   * 获取内裁剪范围。
   */
  get cutoff() {
    return this._light.cutoff;
  }

  /**
   * 设置外裁剪范围。
   */
  set outerCutoff(value: number) {
    this._light.outerCutoff = value;
  }

  /**
   * 获取外裁剪范围。
   */
  get outerCutoff() {
    return this._light.outerCutoff;
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
