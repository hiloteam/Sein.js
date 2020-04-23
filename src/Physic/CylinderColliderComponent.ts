/**
 * @File   : CylinderColliderComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/21/2018, 11:12:31 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {EColliderType, ICylinderColliderOptions} from '../types/Physic';
import ColliderComponent from './ColliderComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`CylinderColliderComponent`。
 */
export function isCylinderColliderComponent(value: SObject): value is CylinderColliderComponent {
  return (value as CylinderColliderComponent).isCylinderColliderComponent;
}

/**
 * 圆柱碰撞体，不太常用。
 * 
 * @noInheritDoc
 */
@SClass({className: 'CylinderColliderComponent', classType: 'Collider'})
export default class CylinderColliderComponent extends ColliderComponent<ICylinderColliderOptions> {
  public isCylinderColliderComponent = true;

  protected _type: EColliderType = EColliderType.Cylinder;

  protected getDefaultOptions() {
    return null;
  }
}
