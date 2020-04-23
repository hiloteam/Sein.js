/**
 * @File   : PointToPointJointComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/7/2020, 5:58:30 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {IPointToPointJointOptions, EJointType} from '../types/Physic';
import JointComponent from './JointComponent';
import SObject from '../Core/SObject';
import {Vector3} from '../Core/Math';

/**
 * 判断一个实例是否为`PointToPointJointComponent`。
 */
export function isPointToPointJointComponent(value: SObject): value is PointToPointJointComponent {
  return (value as PointToPointJointComponent).isPointToPointJointComponent;
}

/**
 * 点对点约束关节。
 * 
 * @noInheritDoc
 */
@SClass({className: 'PointToPointJointComponent', classType: 'Collider'})
export default class PointToPointJointComponent extends JointComponent<IPointToPointJointOptions> {
  public isPointToPointJointComponent = true;
  protected _type: EJointType = EJointType.PointToPoint;
}
