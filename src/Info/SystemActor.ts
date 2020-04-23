/**
 * @File   : SystemActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/1/2019, 11:43:21 AM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SObject from '../Core/SObject';
import InfoActor from '../Info/InfoActor';

/**
 * 判断一个实例是否为`SystemActor`。
 */
export function isSystemActor(value: SObject): value is SystemActor {
  return (value as SystemActor).isSystemActor;
}

/**
 * 系统Actor基类，派生一些系统类，比如物理引擎管理、声音系统等全局规则型Actor，它们在更新队列的最先端。
 * 
 * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
 * 
 * @noInheritDoc
 */
@SClass({className: 'SystemActor'})
export default class SystemActor<IOptionTypes extends Object = {}> extends InfoActor<IOptionTypes> {
  public isSystemActor = true;
  public readonly updatePriority = InfoActor.UPDATE_PRIORITY.System;
}
