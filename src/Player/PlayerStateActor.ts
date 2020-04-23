/**
 * @File   : PlayerStateActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/30/2018, 11:50:05 AM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import StateActor from '../Info/StateActor';
import ControllerActor from '../Player/ControllerActor';
import PlayerControllerActor from '../Player/PlayerControllerActor';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`PlayerStateActor`。
 */
export function isPlayerStateActor(value: SObject): value is PlayerStateActor {
  return (value as PlayerStateActor).isPlayerStateActor;
}

/**
 * 用户状态类，可被`ControllerActor`关联。
 * 和玩家系统有关，详见[Player](./player)。
 * 
 * @template IOptionTypes 初始化参数类型。
 * @noInheritDoc
 */
@SClass({className: 'PlayerStateActor'})
export default class PlayerStateActor<IOptionTypes extends Object = {}> extends StateActor<IOptionTypes> {
  public isPlayerStateActor = true;

  protected _controller: ControllerActor;

  /**
   * 获取当前关联的Controller。
   */
  public getController<TController extends PlayerControllerActor = PlayerControllerActor>(): TController {
    return this._controller as TController;
  }
}
