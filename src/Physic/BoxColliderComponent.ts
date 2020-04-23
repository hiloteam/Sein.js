/**
 * @File   : BoxColliderComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/21/2018, 11:11:54 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {EColliderType, IBoxColliderOptions} from '../types/Physic';
import ColliderComponent from './ColliderComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`BoxColliderComponent`。
 */
export function isBoxColliderComponent(value: SObject): value is BoxColliderComponent {
  return (value as BoxColliderComponent).isBoxColliderComponent;
}

/**
 * 盒碰撞体，最常见的碰撞体之一。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BoxColliderComponent', classType: 'Collider'})
export default class BoxColliderComponent extends ColliderComponent<IBoxColliderOptions> {
  public isBoxColliderComponent = true;
  protected _type: EColliderType = EColliderType.Box;

  protected getDefaultOptions() {
    return null;
  }
}
