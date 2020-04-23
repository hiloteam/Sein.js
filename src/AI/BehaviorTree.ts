/**
 * @File   : BehaviorTree.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/18/2018, 10:24:16 AM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';

@SClass({className: 'BehaviorTree', classType: 'BehaviorTree'})
export default class BehaviorTree extends SObject {
  public isBehaviorTree = true;
}
