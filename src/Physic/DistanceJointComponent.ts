/**
 * @File   : DistanceJointComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/7/2020, 5:58:40 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {IDistanceJointOptions, EJointType} from '../types/Physic';
import JointComponent from './JointComponent';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`DistanceJointComponent`。
 */
export function isDistanceJointComponent(value: SObject): value is DistanceJointComponent {
  return (value as DistanceJointComponent).isDistanceJointComponent;
}

/**
 * 距离约束关节。
 * 
 * @noInheritDoc
 */
@SClass({className: 'DistanceJointComponent', classType: 'Collider'})
export default class DistanceJointComponent extends JointComponent<IDistanceJointOptions> {
  public isDistanceJointComponent = true;
  protected _type: EJointType = EJointType.Distance;
}
