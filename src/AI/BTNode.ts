/**
 * @File   : BTNode.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/27/2018, 2:05:01 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';

@SClass({className: 'BTNode', classType: 'BTNode'})
export default class BehaviorTree extends SObject {
  public isBTNode = true;
}
