/**
 * @File   : PlaneColliderComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/23/2018, 11:17:26 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {EColliderType, IPlaneColliderOptions} from '../types/Physic';
import ColliderComponent from './ColliderComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`PlaneColliderComponent`。
 */
export function isPlaneColliderComponent(value: SObject): value is PlaneColliderComponent {
  return (value as PlaneColliderComponent).isPlaneColliderComponent;
}

/**
 * 平面碰撞体，不建议使用。
 * 
 * @noInheritDoc
 */
@SClass({className: 'PlaneColliderComponent', classType: 'Collider'})
export default class PlaneColliderComponent extends ColliderComponent<IPlaneColliderOptions> {
  public isPlaneColliderComponent = true;

  protected _type: EColliderType = EColliderType.Plane;

  protected getDefaultOptions() {
    return null;
  }
}
