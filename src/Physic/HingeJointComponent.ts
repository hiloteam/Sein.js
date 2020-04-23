/**
 * @File   : HingeJointComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/7/2020, 5:58:07 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {IHingeJointOptions, EJointType} from '../types/Physic';
import JointComponent from './JointComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`HingeJointComponent`。
 */
export function isHingeJointComponent(value: SObject): value is HingeJointComponent {
  return (value as HingeJointComponent).isHingeJointComponent;
}

/**
 * 铰链关节。
 * 
 * @noInheritDoc
 */
@SClass({className: 'HingeJointComponent', classType: 'Collider'})
export default class HingeJointComponent extends JointComponent<IHingeJointOptions> {
  public isHingeJointComponent = true;
  protected _type: EJointType = EJointType.Hinge;
}
