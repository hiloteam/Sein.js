/**
 * @File   : StateActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/28/2018, 2:44:39 AM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import InfoActor from './InfoActor';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`StateActor`。
 */
export function isStateActor(value: SObject): value is StateActor {
  return (value as StateActor).isStateActor;
}

/**
 * 状态管理Actor类。记录一些状态，比如`Game`所用的`GameState`、`World`所用的`WorldState`。
 * 
 * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
 * 
 * @noInheritDoc
 */
@SClass({className: 'StateActor'})
export default class StateActor<IOptionTypes extends Object = {}> extends InfoActor<IOptionTypes> {
  public isStateActor = true;
  public readonly updatePriority = InfoActor.UPDATE_PRIORITY.State;

  public copy(state: StateActor) {
    if (!state) {
      return;
    }

    return this;
  }
}
