/**
 * @File   : LightComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/8/2019, 3:21:29 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneComponent from '../Renderer/SceneComponent';
import Hilo3d from '../Core/Hilo3d';
import {Color} from '../Core/Math';
import {IShadowOptions} from '../types/Renderer';
import {ISceneComponentState} from '../Renderer/SceneComponent';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`LightComponent`。
 */
export function isLightComponent(value: SObject): value is LightComponent {
  return (value as LightComponent).isLightComponent;
}

/**
 * 判断一个实例是否为`AmbientLightActor`。
 */
export function isLightActor(value: SObject): value is SceneActor<any, LightComponent> {
  return isSceneActor(value) && isLightComponent(value.root);
}

/**
 * `LightComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface ILightComponentState extends ISceneComponentState {
  /**
   * 光照强度。
   */
  amount?: number;
  /**
   * 光照颜色。
   */
  color?: Color;
  /**
   * 阴影属性。
   */
  shadow?: IShadowOptions;
}

/**
 * 环境光组件。
 *
 * @noInheritDoc
 */
@SClass({className: 'LightComponent'})
export default class LightComponent<IState extends ILightComponentState = ILightComponentState> extends SceneComponent<IState> {
  public isLightComponent: boolean = true;
  public needUpdateAndDestroy: boolean = false;

  protected _light: Hilo3d.Light;

  protected onCreateLight(options: IState): Hilo3d.Light {
    throw new Error('Not Implement !');
  }

  /**
   * 初始化，继承请先`super.onInit()`。
   */
  public onInit(options: IState) {
    super.onInit(options);

    this._light = this.onCreateLight(options);
    (this._light as any).__forceUseParentWorldMatrix = true;
    this._node.addChild(this._light);
  }

  /**
   * 设置光照强度。
   */
  set amount(value: number) {
    this._light.amount = value;
  }

  /**
   * 获取光照强度。
   */
  get amount() {
    return this._light.amount;
  }

  /**
   * 设置光照颜色。
   */
  set color(value: Color) {
    this._light.color.copy(value);
  }

  /**
   * 获取光照颜色。
   */
  get color() {
    return this._light.color;
  }

  /**
   * 设置阴影参数。
   */
  set shadow(value: IShadowOptions) {
    this._light.shadow = value;
  }

  /**
   * 获取阴影参数。
   */
  get shadow() {
    return this._light.shadow;
  }
}
