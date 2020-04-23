/**
 * @File   : LockJointComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/7/2020, 5:58:50 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {ILockJointOptions, EJointType} from '../types/Physic';
import JointComponent from './JointComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`LockJointComponent`。
 */
export function isLockJointComponent(value: SObject): value is LockJointComponent {
  return (value as LockJointComponent).isLockJointComponent;
}

/**
 * 锁定约束关节。
 * 
 * @noInheritDoc
 */
@SClass({className: 'LockJointComponent', classType: 'Collider'})
export default class LockJointComponent extends JointComponent<ILockJointOptions> {
  public isLockJointComponent = true;
  protected _type: EJointType = EJointType.Lock;
}
