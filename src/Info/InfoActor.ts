/**
 * @File   : InfoActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/28/2018, 2:43:05 AM
 * @Description:
 */
import Actor from '../Core/Actor';
import {SClass} from '../Core/Decorator';
import SObject from '../Core/SObject';
import Component from '../Core/Component';

/**
 * 判断一个实例是否为`InfoActor`。
 */
export function isInfoActor(value: SObject): value is InfoActor {
  return (value as InfoActor).isInfoActor;
}

/**
 * 信息管理Actor基类。单纯的书记官，不放入场景内，仅仅作为信息的记录者。
 * 一般不直接使用，而是使用其派生类。
 * 
 * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
 * @template TRootComponent 根组件类型。
 * 
 * @noInheritDoc
 */
@SClass({className: 'InfoActor'})
export default class InfoActor<
  IOptionTypes extends Object = {},
  TRootComponent extends Component = Component<any>
> extends Actor<IOptionTypes, TRootComponent> {
  /**
   * 默认的更新优先级。
   * 
   * @member System 约定占用1000 ~ 2000
   * @member GameMode 约定占用2000 ~ 3000
   * @member LevelScript 约定占用3000 ~ 4000
   * @member State 约定占用4000 ~ 5000
   * @member Others 其他，默认直接追加到最后
   */
  public static UPDATE_PRIORITY = {
    System: 1000,
    GameMode: 2000,
    LevelScript: 3000,
    State: 4000,
    Others: -1
  };

  public isInfoActor = true;
  /**
   * 更新优先级，只可在派生时指定，不可在初始化后的运行时修改！
   */
  public readonly updatePriority: number = InfoActor.UPDATE_PRIORITY.Others;
}
