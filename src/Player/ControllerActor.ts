/**
 * @File   : ControllerActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/29/2018, 10:55:24 PM
 * @Description:
 */
import SceneActor from '../Renderer/SceneActor';
import PlayerStateActor from '../Player/PlayerStateActor';
import {SClass} from '../Core/Decorator';
import throwException from '../Exception/throwException';
import {ISceneComponentState} from '../Renderer/SceneComponent';
import SObject from '../Core/SObject';
import BreakGuardException from '../Exception/BreakGuardException';

/**
 * `ControllerActor`的初始化参数类型。
 */
export interface IControllerActorState<IState, IActor> extends ISceneComponentState {
  actor?: IActor;
  state?: IState;
  followActor?: boolean;
}

/**
 * 判断一个实例是否为`ControllerActor`。
 */
export function isControllerActor(value: SObject): value is ControllerActor {
  return (value as ControllerActor).isControllerActor;
}

/**
 * 控制器类，作为`World`中棋子SceneActor的抽象逻辑控制代理。
 * 一般不直接使用，而是使用其派生类`PlayerControllerActor`和`AIControllerActor`。
 * 和玩家系统有关，详见[Player](./player)。
 * 
 * @template IState 指定状态的类型。
 * @template IActor 指定允许控制的Actor的类型。
 * @noInheritDoc
 */
@SClass({className: 'ControllerActor', classType: 'Controller'})
export default class ControllerActor<
  IState extends PlayerStateActor = PlayerStateActor,
  IActor extends SceneActor = SceneActor
> extends SceneActor<IControllerActorState<IState, IActor>> {
  public isControllerActor = true;

  protected _actor: IActor;
  protected _state: IState;
  protected _follow: boolean = false;

  /**
   * 获取当前控制的actor。
   */
  get actor() {
    return this._actor;
  }

  /**
   * 获取当前关联的状态。
   */
  get state() {
    return this._state;
  }

  /**
   * 生命周期，将在获得了一个actor的控制权时呗触发。
   */
  public onPossesActor(actor: IActor) {

  }

  /**
   * 生命周期，将在失去了一个actor的控制权时呗触发。
   */
  public onDisPossesActor(actor: IActor) {

  }

  /**
   * 控制一个actor。
   */
  public possessActor(actor: IActor) {
    if (this._actor) {
      throw new BreakGuardException(this, `Controller ${this.name} already has actor ${this.actor.name} !`);
    }

    if ((actor as any)._controller) {
      throw new BreakGuardException(this, `Actor ${actor.name} already controlled by controller ${actor.getController().name} !`);
    }

    this._actor = actor;
    (this._actor as any)._controller = this;

    try {
      this.onPossesActor(actor);
    } catch (error) {
      throwException(error, this);
    }

    return this;
  }

  /**
   * 解除一个actor的控制。
   * 
   * @param transferTo 如果存在，将当前控制的actor的控制权移交。
   */
  public dispossessActor(transferTo?: ControllerActor) {
    try {
      this.onDisPossesActor(this._actor);
    } catch (error) {
      throwException(error, this);
    }

    if (this._actor) {
      (this._actor as any).controller = null;
    }

    this._actor = null;

    if (transferTo) {
      transferTo.possessActor(this);
    }

    return this;
  }

  /**
   * 获取当前控制的actor，可用于类型推断。
   */
  public getActor<TActor extends IActor = IActor>(): TActor {
    return this._actor as TActor;
  }

  public switchState(state: IState) {
    if ((state as any).controller) {
      (state as any).controller._state = null;
    }

    this._state = state;
    (state as any)._controller = this;

    return this;
  }

  /**
   * 获取当前关联的状态，可用于类型推断。
   */
  public getState<TState extends IState = IState>(): TState {
    return this._state as TState;
  }

  /**
   * 跟随actor，由于ControllerActor自身也是`SceneActor`，所以其自己也有`transform`。
   * 你可以给其添加一个摄像机组件来达成一些有意思的玩法。
   */
  public followActor() {
    this._follow = true;

    return this;
  }

  /**
   * 取消跟随`Actor`。
   */
  public unFollowActor() {
    this._follow = false;

    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public added() {
    super.added();

    const initState = this._initOptions;

    if (initState.state) {
      this.switchState(initState.state);
    }

    if (initState.actor) {
      this.possessActor(initState.actor);
    }

    this._follow = !!initState.followActor;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public update(delta: number) {
    super.update(delta);

    if (this._follow && this._actor) {
      this.transform.matrix.copy(this._actor.transform.matrix);
    }
  }
}
