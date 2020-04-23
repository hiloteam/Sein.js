/**
 * @File   : PlayerController.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午7:01:23
 * @Description:
 */
import ControllerActor from '../Player/ControllerActor';
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import Player from '../Player/Player';
import PlayerStateActor from '../Player/PlayerStateActor';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`PlayerControllerActor`。
 */
export function isPlayerControllerActor(value: SObject): value is PlayerControllerActor {
  return (value as PlayerControllerActor).isPlayerControllerActor;
}

/**
 * 玩家控制器类，区别于AI控制器，和玩家系统有关，详见[Player](./player)。
 * 
 * @template IState 指定状态的类型。
 * @template IActor 指定允许控制的Actor的类型。
 * @noInheritDoc
 */
@SClass({className: 'PlayerControllerActor'})
export default class PlayerControllerActor<
  IState extends PlayerStateActor = PlayerStateActor,
  IActor extends SceneActor = SceneActor
> extends ControllerActor<IState, IActor> {
  public isPlayerControllerActor = true;
  public persistent = true;

  protected _player: Player;

  /**
   * 获取当前拥有自身的玩家。
   */
  get player() {
    return this._player;
  }

  /**
   * 设置当前拥有自身的玩家。
   */
  public setPlayer(player: Player) {
    player.switchController(this);

    return this;
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    if (this._player) {
      this._player.releaseController();
    }

    super.onDestroy();
  }
}
