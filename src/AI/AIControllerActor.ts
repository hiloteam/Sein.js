/**
 * @File   : AIControllerActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午7:01:41
 * @Description:
 */
import ControllerActor from '../Player/ControllerActor';
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import PlayerStateActor from '../Player/PlayerStateActor';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`AIControllerActor`。
 */
export function isAIControllerActor(value: SObject): value is AIControllerActor {
  return (value as AIControllerActor).isAIControllerActor;
}

/**
 * AI控制器类，区别于玩家控制器，完全由代码逻辑控制。
 * 和玩家系统有关，详见[Player](./player)。
 * 
 * @template IState 指定状态的类型。
 * @template IActor 指定允许控制的Actor的类型。
 * @noInheritDoc
 */
@SClass({className: 'AIControllerActor'})
export default class AIControllerActor<
  IState extends PlayerStateActor = PlayerStateActor,
  IActor extends SceneActor = SceneActor
> extends ControllerActor<IState, IActor> {
  public isAIControllerActor = true;

  // todo: 添加默认行为树
}
