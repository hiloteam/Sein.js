/**
 * @File   : AmbientLightComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 8:06:09 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import Hilo3d from '../Core/Hilo3d';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';
import LightComponent, {ILightComponentState} from '../Light/LightComponent';

/**
 * 判断一个实例是否为`AmbientLightComponent`。
 */
export function isAmbientLightComponent(value: SObject): value is AmbientLightComponent {
  return (value as AmbientLightComponent).isAmbientLightComponent;
}

/**
 * 判断一个实例是否为`AmbientLightActor`。
 */
export function isAmbientLightActor(value: SObject): value is SceneActor<any, AmbientLightComponent> {
  return isSceneActor(value) && isAmbientLightComponent(value.root);
}

/**
 * `AmbientLightComponent`的初始化参数类型。
 * 
 * @noInheritDoc
 */
export interface IAmbientLightComponentState extends ILightComponentState {}

/**
 * 环境光组件。
 *
 * @noInheritDoc
 */
@SClass({className: 'AmbientLightComponent'})
export default class AmbientLightComponent extends LightComponent<IAmbientLightComponentState> {
  public isAmbientLightComponent: boolean = true;
  public needUpdateAndDestroy: boolean = false;

  protected _light: Hilo3d.AmbientLight;

  protected onCreateLight(options: IAmbientLightComponentState) {
    return new Hilo3d.AmbientLight(options);
  }
}
