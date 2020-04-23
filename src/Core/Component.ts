/**
 * @File   : Component.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午2:10:11
 * @Description:
 */
import SObject from '../Core/SObject';
import Actor from '../Core/Actor';
import Game from '../Core/Game';
import World from '../Core/World';
import Level from '../Core/Level';
import EventManager from '../Event/EventManager';
import {SClass} from '../Core/Decorator';
import BaseException from '../Exception/BaseException';
import throwException from '../Exception/throwException';
import StateActor from '../Info/StateActor';
import {IPhysicWorld} from '../types/Physic';

/**
 * 判断一个实例是否为`Component`。
 */
export function isComponent(value: SObject): value is Component {
  return (value as Component).isComponent;
}

/**
 * 游戏实体的功能的最小抽象，是Actor实际功能的体现。
 * 
 * @template IStateTypes 初始化参数类型，一般交由由继承的类定义实现多态。
 * @noInheritDoc
 */
@SClass({className: 'Component', classType: 'Component'})
export default class Component<IStateTypes extends Object = any> extends SObject {
  public isComponent: boolean = true;
  /**
   * 自身是否为根组件。
   */
  public isRoot: boolean = false;
  /**
   * Component是否需要在每一帧进行进行`update`调用，如果为`false`，则将不会触发`onUpdate`生命周期（包括挂载在其下的所有Component）。
   * 用于性能优化。
   */
  public updateOnEverTick: boolean = true;
  /**
   * 是否要将自身加入其挂载的Actor的更新队列中，同时决定自身是否要跟随Actor销毁。
   * 如果为`false`，则说明此Component是一个纯静态组件（比如单纯的图元组件，没有逻辑）。
   * 用于性能优化。
   */
  public needUpdateAndDestroy: boolean = true;
  /**
   * 是否允许自身在运行时被动态移除，用于保护某些特殊Component，比如根组件默认不可移除。
   */
  public canBeRemoved: boolean = true;

  /**
   * @hidden
   */
  public STATE_TYPE: IStateTypes;
  protected _owner: Actor = null;
  protected _event: EventManager = null;
  protected _initState: IStateTypes;

  /**
   * 构造Component，**不可自行构造！！！**请参见`actor.addComponent`方法。
   */
  constructor(
    name: string,
    actor: Actor,
    initState?: IStateTypes
  ) {
    super(name);

    this._initState = initState || {} as IStateTypes;
    this._owner = actor;
    this._event = new EventManager(this);
  }

  /**
   * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
   */
  get parent(): Actor | Component {
    return this._owner;
  }

  /**
   * 获取自身的事件系统管理器。
   */
  get event() {
    return this._event;
  }

  /**
   * 用于验证一个该组件在当前状态是否可被添加，一般用于防止重复添加不可重复的组件。
   * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
   * 注意，此验证仅会在`development`环境下被执行！
   */
  public verifyAdding(initState: IStateTypes): void {}

  /**
   * 用于验证一个该组件在当前状态是否可被移除。
   * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
   * 注意，此验证仅会在`development`环境下被执行！
   */
  public verifyRemoving(): void {}

  /**
   * 生命周期，将在Component被创建后调用。
   */
  public onInit(initState: IStateTypes) {

  }

  /**
   * 生命周期，将在加入了Actor并且父级Actor被正式添加到了游戏中后调用。
   */
  public onAdd(initState: IStateTypes) {

  }

  /**
   * 生命周期，将在正式加入游戏后，并且`updateOnEverTick`与`needUpdateAndDestroy`均为`true`时在每一帧被调用。
   */
  public onUpdate(delta: number) {

  }

  /**
   * 生命周期，用于错误边界处理。将在游戏中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
   * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
   * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
   */
  public onError(error: BaseException, details?: any): boolean | void {

  }

  /**
   * 当父级Actor被`unLink`时触发，详见[actor.unLink](../classes/actor#unlink).
   */
  public onUnLink() {

  }

  /**
   * 当父级Actor被`reLink`时触发，详见[actor.reLink](../classes/actor#relink).
   */
  public onReLink() {

  }

  /**
   * 生命周期，将在Component被销毁时触发。
   */
  public onDestroy() {

  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public initialized() {
    try {
      this.onInit(this._initState);
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public added() {
    try {
      this.onAdd(this._initState);
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public update(delta: number) {
    if (!this.updateOnEverTick || !this.parent) {
      return;
    }

    try {
      this.onUpdate(delta);
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public unLink() {
    try {
      this.onUnLink();
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public reLink() {
    try {
      this.onReLink();
    } catch (error) {
      throwException(error, this);
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public destroy() {
    if (!this._owner) {
      return;
    }

    this._event.destroy();
    super.destroy();

    this._owner = null;
  }

  /**
   * 获取当前`Game`实例。
   * 
   * @template IGameState 当前游戏状态管理器的类型。
   */
  public getGame<IGameState extends StateActor = StateActor>(): Game<IGameState> {
    return this._owner.getGame<IGameState>();
  }

  /**
   * 获取当前`World`实例。
   * 
   * @template IWorldState 当前世界状态管理器的类型。
   */
  public getWorld<IWorldState extends StateActor = StateActor>(): World<IWorldState> {
    return this._owner.getWorld<IWorldState>();
  }

  /**
   * 获取当前`Level`实例。
   * 
   * @template ILevelState 当前关卡状态管理器的类型。
   */
  public getLevel<ILevelState extends StateActor = StateActor>(): Level<ILevelState> {
    return this._owner.getLevel<ILevelState>();
  }

  /**
   * 仅在初始化了物理引擎之后，用于获取当前物理世界`PhysicWorld`实例。
   * 如何使用物理引擎请见**Guide**和**Demo**。
   */
  public getPhysicWorld(): IPhysicWorld {
    return this._owner.getPhysicWorld();
  }

  /**
   * 获取当前拥有自己的`Actor`。
   * 
   * @template TOwner Actor的类型。
   */
  public getOwner<TOwner extends Actor = Actor>(): TOwner {
    return this._owner as TOwner;
  }

  /**
   * 获取当前拥有自己的`Actor`的根组件。
   * 
   * @template TRoot 根组件的类型。
   */
  public getRoot<TRoot extends Component = Component>(): TRoot {
    return this._owner.root as TRoot;
  }

  /**
   * 将自己从父级移除，基本等同于`destroy`方法，从Owner中销毁自身。
   */
  public removeFromParent() {
    this._owner.removeComponent(this);
  }
}
