/**
 * @File   : SpringJointComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/7/2020, 5:48:44 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {ISpringJointOptions, EJointType} from '../types/Physic';
import JointComponent from './JointComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`SpringJointComponent`。
 */
export function isSpringJointComponent(value: SObject): value is SpringJointComponent {
  return (value as SpringJointComponent).isSpringJointComponent;
}

/**
 * 弹簧关节。
 * 
 * @noInheritDoc
 */
@SClass({className: 'SpringJointComponent', classType: 'Collider'})
export default class SpringJointComponent extends JointComponent<ISpringJointOptions> {
  public isSpringJointComponent = true;
  protected _type: EJointType = EJointType.Spring;

  /**
   * **不要自己使用！**应用弹簧力。
   */
  public applyForce = () => {
    this._joint.applyForce;
  }
}
