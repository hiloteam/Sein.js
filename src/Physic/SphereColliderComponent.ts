/**
 * @File   : SphereColliderComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/21/2018, 11:12:03 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {EColliderType, ISphereColliderOptions} from '../types/Physic';
import ColliderComponent from './ColliderComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`SphereColliderComponent`。
 */
export function isSphereColliderComponent(value: SObject): value is SphereColliderComponent {
  return (value as SphereColliderComponent).isSphereColliderComponent;
}

/**
 * 球碰撞体，最常见的碰撞体之一。
 * 
 * @noInheritDoc
 */
@SClass({className: 'SphereColliderComponent', classType: 'Collider'})
export default class SphereColliderComponent extends ColliderComponent<ISphereColliderOptions> {
  public isSphereColliderComponent = true;
  protected _type: EColliderType = EColliderType.Sphere;

  protected getDefaultOptions() {
    return null;
  }
}
