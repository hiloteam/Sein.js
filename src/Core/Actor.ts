/**
 * @File   : Actor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午5:23:48
 * @Description:
 */
import SObject, {isSObject} from '../Core/SObject';
import Component, {isComponent} from '../Core/Component';
import SName from '../Core/SName';
import Game from '../Core/Game';
import World, {isWorld} from '../Core/World';
import Level from '../Core/Level';
import {SClass} from '../Core/Decorator';
import ChildActorComponent, {isChildActorComponent} from '../Core/ChildActorComponent';
import {TConstructor} from '../types/Common';
import BaseException from '../Exception/BaseException';
import throwException from '../Exception/throwException';
import BreakGuardException from '../Exception/BreakGuardException';
import MemberConflictException from '../Exception/MemberConflictException';
import SceneComponent, {isSceneComponent} from '../Renderer/ISceneComponent';
import Debug from '../Debug';
import SMap from '../DataStructure/SMap';
import StateActor from '../Info/StateActor';
import {IPhysicWorld} from '../types/Physic';
import SArray from '../DataStructure/SArray';
import {isSceneActor} from '../Renderer/ISceneActor';

/**
 * 判断一个实例是否为`Actor`。
 */
export function isActor(value: SObject): value is Actor {
  return (value as Actor).isActor;
}

/**
 * 游戏世界的基石，作为Components的封装容器。
 * 自身可以包含一定程度的业务逻辑，但不推荐，推荐在专用Actor中编写业务逻辑，比如`GameModeActor`和`LevelScriptActor`。
 * 
 * @template IOptionTypes 初始化参数类型，一般交由由继承的类定义实现多态。
 * @template TRootComponent 根级组件类型，一般交由由继承的类定义实现多态。
 * 
 * @noInheritDoc
 */
@SClass({className: 'Actor', classType: 'Actor'})
export default class Actor<
  IOptionTypes extends Object = {},
  TRootComponent extends Component = Component<any>
> extends SObject {
  public isActor: boolean = true;
  /**
   * @hidden
   */
  public OPTIONS_TYPE: IOptionTypes;
  /**
   * Actor是否需要在每一帧进行进行`update`调用，如果为`false`，则将不会触发`onUpdate`生命周期（包括挂载在其下的所有Component）。
   * 用于性能优化。
   */
  public updateOnEverTick: boolean = true;
  /**
   * 在Actor自身销毁时，是否同时需要触发其下挂载的所有Component的销毁，也就是`onDestroy`生命周期的调用。
   * 用于性能优化。
   */
  public emitComponentsDestroy: boolean = true;
  /**
   * 用于给Actor归类的标签，可以用于后续的快速索引。
   */
  public tag: SName = new SName('UnTagged');

  protected _game: Game = null;
  protected _root: TRootComponent = null;
  protected _components: SMap<Component> = new SMap();
  protected _componentsForUpdate: SArray<Component> = new SArray();
  protected _componentsNeedUpdate: boolean = false;
  protected _parent: Level | World | Game | ChildActorComponent = null;
  protected _initOptions: IOptionTypes;
  protected _inWorld: boolean = false;
  protected _linked: boolean = false;

  /**
   * 构造Actor，**不可自行构造！！！**请参见`game.addActor`或`world.addActor`方法。
   */
  constructor (
    name: string,
    game: Game,
    initOptions?: IOptionTypes
  ) {
    super(name);

    this._game = game;
    this._initOptions = initOptions;
  }

  /**
   * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
   */
  get parent() {
    return this._parent;
  }

  /**
   * Actor是否被连接到了舞台上。
   */
  get linked() {
    return this._linked;
  }

  /**
   * Actor自身范围内的事件系统管理器，将会直接代理到其的根组件`root`。
   */
  get event(): TRootComponent['event'] {
    return this._root.event;
  }

  /**
   * Actor自身的根组件。一般来讲创建后就不会变更。
   */
  get root(): TRootComponent {
    return this._root;
  }

  /**
   * 用于验证改Actor在当前状态是否可被添加，一般用于防止重复添加不可重复的系统Actor等。
   * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
   * 注意，此验证仅会在`development`环境下被执行！
   */
  public verifyAdding(initOptions: IOptionTypes): void {}

  /**
   * 用于验证该Actor在当前状态是否可被移除。
   * 你可以重写此方法来达成验证，如果验证不通过请抛出异常。
   * 注意，此验证仅会在`development`环境下被执行！
   */
  public verifyRemoving(): void {}

  /**
   * 生命周期，将在Actor被创建时最先调用，用于创建从属于该Actor的根组件。
   * 在原生Actor中均有默认值，你可以用此周期来定义你自己的Actor。
   */
  public onCreateRoot(initOptions: IOptionTypes): TRootComponent {
    return this.addComponent('root', Component) as TRootComponent;
  }

  /**
   * 生命周期，将在Actor创建了根组件后、在正式被添加到游戏中之前被调用。
   */
  public onInit(initOptions: IOptionTypes) {

  }

  /**
   * 生命周期，将在Actor被正式加入到游戏中之后被调用。
   */
  public onAdd(initOptions: IOptionTypes) {

  }

  /**
   * 生命周期，将在Actor被正式加入到游戏中之后，并且`updateOnEverTick`为`true`时在每一帧被调用。
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
   * 生命周期，将在调用`actor.unLink`方法后触发。
   */
  public onUnLink() {

  }

  /**
   * 生命周期，将在调用`actor.reLink`方法后触发。
   * 
   * @param parent 要恢复连接到的父级。
   */
  public onReLink(parent: Actor | World | Game) {

  }

  /**
   * 生命周期，将在Actor被销毁时触发。
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
      this._root = this.onCreateRoot(this._initOptions);
      this._componentsForUpdate.add(this._root);
    } catch (error) {
      throwException(error, this);
    }
    this._root.isRoot = true;

    try {
      this.onInit(this._initOptions);
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
    if (this._inWorld) {
      return;
    }

    this._inWorld = true;
    this._linked = true;

    this._components.forEach(component => {
      component.added();
    });

    try {
      this.onAdd(this._initOptions);
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
    this.syncComponentsNeedUpdate();

    if (!this.updateOnEverTick || !this._inWorld || !this._parent) {
      return;
    }

    try {
      this.onUpdate(delta);
    } catch (error) {
      throwException(error, this);
    }

    this._componentsForUpdate.forEach(component => {
      component.update(delta);
    });
  }

  /**
   * 将一个已经创建的`actor`从游戏世界中移除，但仍然保留其状态。之后可以用`reLink`方法让其重新和游戏世界建立连接。
   * 注意如果有子级`actor`，并不会自动`unLink`！
   * 这一般用于性能优化，比如对象池的创建。
   */
  public unLink(): this {
    if (!this._linked) {
      return this;
    }

    try {
      this.onUnLink();
    } catch (error) {
      throwException(error, this);
    }

    this.syncComponentsNeedUpdate();
    this._componentsForUpdate.forEach(component => component.unLink());

    const parent = this._parent;
    let realParent: Game | Level | World;

    if (isChildActorComponent(parent)) {
      parent.autoDestroyActor = false;
      parent.removeFromParent();
      this._parent = parent.getOwner() as any;

      realParent = !isSceneActor(parent.getOwner()) ? parent.getGame() : parent.getWorld();
    } else {
      realParent = parent;
    }

    /**
     * @todo: fix types
     */
    (realParent.actors as any).remove(this as any);
    (realParent as any)._actorsNeedUpdate = true;

    this._linked = false;

    return this;
  }

  /**
   * 将一个已经使用`unLink`方法和游戏世界断开连接的`actor`恢复连接，将其重新加入世界中。
   * 这一般用于性能优化，比如对象池的创建。
   * 
   * @param parent 指定要恢复连接到的父级，不指定则使用上一次的父级。
   */
  public reLink(parent?: Actor | World | Game): this {
    if (this._linked) {
      return this;
    }

    parent = parent || (this._parent as any);
    let realParent: Game | World;

    if (isActor(parent)) {
      realParent = !isSceneActor(parent) ? parent.getGame() : parent.getWorld();
    } else {
      realParent = parent;
    }

    if (isWorld(realParent) && this.getGame().world !== realParent) {
      throw new Error(`ReLink error! Current world is different from pre world !`);
    }

    /**
     * @todo: fix types
     */
    (realParent.actors as any).add(this as any);
    (realParent as any)._actorsNeedUpdate = true;

    if (isActor(parent)) {
      parent.addChild(this);
    }

    try {
      this.onReLink(parent);
    } catch (error) {
      throwException(error, this);
    }

    this.syncComponentsNeedUpdate();
    this._componentsForUpdate.forEach(component => component.reLink());

    this._linked = true;

    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public destroy() {
    if (this.emitComponentsDestroy) {
      this.syncComponentsNeedUpdate();
      this._componentsForUpdate.forEach(component => component.destroy());
    } else {
      this._root.destroy();
    }

    super.destroy();
    this._parent = null;
  }

  private syncComponentsNeedUpdate() {
    if (this._componentsNeedUpdate) {
      this._componentsForUpdate.clear();

      this._components.forEach(item => {
        if (item.isRoot || item.needUpdateAndDestroy) {
          this._componentsForUpdate.add(item);
        }
      });

      this._componentsNeedUpdate = false;
    }
  }

  /**
   * 获取当前`Game`实例。
   * 
   * @template IGameState 当前游戏状态管理器的类型。
   */
  public getGame<IGameState extends StateActor = StateActor>(): Game<IGameState> {
    return this._game as Game<IGameState>;
  }

  /**
   * 获取当前`World`实例。
   * 
   * @template IWorldState 当前世界状态管理器的类型。
   */
  public getWorld<IWorldState extends StateActor = StateActor>(): World<IWorldState> {
    return this._game.world as World<IWorldState>;
  }

  /**
   * 获取当前`Level`实例。
   * 
   * @template ILevelState 当前关卡状态管理器的类型。
   */
  public getLevel<ILevelState extends StateActor = StateActor>(): Level<ILevelState> {
    return this._game.level as Level<ILevelState>;
  }

  /**
   * 仅在初始化了物理引擎之后，用于获取当前物理世界`PhysicWorld`实例。
   * 如何使用物理引擎请见**Guide**和**Demo**。
   */
  public getPhysicWorld(): IPhysicWorld {
    return this._game.world.physicWorld;
  }

  /**
   * 将自己从父级移除，基本等同于`destroy`方法，从游戏中销毁自身。
   */
  public removeFromParent() {
    if (!this._parent) {
      throwException(
        new Error(`Actor ${this.name} has no parent, is it an invalid reference to an actor is already removed from world ?`),
        this
      );
    }

    (this._parent.removeActor as any)(this);
  }

  /**
   * 根据指定的`ComponentClass`和其初始化参数`initState`来添加一个Component。**注意这里要求每个Component的名字`name`是唯一的**。
   * 如果是在`world`中添加一个`SceneComponent`，你可以指定一个`parent`作为要添加的Component的父级，让它们在渲染层连接起来。
   */
  public addComponent<IComponent extends Component<any>>(
    name: string,
    ComponentClass: TConstructor<IComponent>,
    initState?: IComponent['STATE_TYPE'],
    parent?: SceneComponent
  ): IComponent {
    if (this._components.has(name)) {
      throw new MemberConflictException(this, 'Component', name, this);
    }

    if (parent && parent.getOwner() !== this) {
      throw new BreakGuardException(
        this, `Owner of parent component ${parent.name} must be same to owner of child ${this.name}`
      );
    }

    const component = new ComponentClass(name, this, initState);

    if (parent && (!isSceneComponent(parent) || !isSceneComponent(component))) {
      throw new BreakGuardException(
        this,
        `Only SceneComponent could have child SceneComponent ! 
Current parent: ${parent.name}(${parent.className}), child: ${component.name}(${component.className})`
      );
    }

    if (Debug.devMode) {
      try {
        component.verifyAdding(initState);
      } catch (error) {
        throwException(error, component);
        return;
      }
    }

    this._components.set(name, component);
    component.initialized();

    if (isSceneComponent(component)) {
      if (parent) {
        parent.addChild(component);
      } else if (this._root && isSceneComponent(this._root)) {
        this._root.addChild(component);
      } else {
        (component as any)._parent = this;
      }
    } else {
      (component as any)._parent = this;
    }

    if (this._inWorld) {
      component.added();
    }

    if (component.needUpdateAndDestroy) {
      this._componentsNeedUpdate = true;
    }

    return component;
  }

  /**
   * 通过名字移除一个Component。
   */
  public removeComponent(name: string): void;
  /**
   * 移除一个指定的Component。
   */
  public removeComponent(component: Component): void;
  public removeComponent(value: string | Component) {
    let component: Component;

    if (isSObject(value) && isComponent(value)) {
      component = value;
    } else {
      component = this._components.get(value);
    }

    if (!component) {
      return this;
    }

    if (!component.canBeRemoved || component.isRoot) {
      throw new BreakGuardException(
        this,
        `In actor ${this.name}, component ${component.name} can not be removed.
It's one of '!canBeRemoved', 'root'`);
    }

    if (Debug.devMode) {
      try {
        component.verifyRemoving();
      } catch (error) {
        throwException(error, component);
        return;
      }
    }

    if (component.parent && isSceneComponent(component.parent)) {
      component.parent.removeChild(component as SceneComponent);
      this.clearSceneComponent(component as SceneComponent);
    }

    component.destroy();
    this._components.remove(component.name.value);

    if (component.needUpdateAndDestroy) {
      this._componentsNeedUpdate = true;
    }

    return this;
  }

  /**
   * 将一个Actor作为自身的子级，注意子级Actor将仍然存在于`game`或者`world`中，并拥有自身独立的生命周期，这里只是建立了一个连接关系。
   * 如果父子为`SceneActor`，那么这层链接关系还会反映到渲染层，同时可以指定一个`SceneComponent`作为其父级节点。
   */
  public addChild(actor: Actor, parentComponent?: Component) {
    if (actor.parent && isChildActorComponent(actor.parent)) {
      actor.parent.getOwner().removeComponent(actor.parent);
    }

    this.addComponent(
      actor.name.value,
      ChildActorComponent,
      {actor, parent: parentComponent}
    );
  }

  /**
   * 解除自身和一个子级Actor的链接。注意此方法也会直接将子级Actor从游戏中销毁！
   * 如果只是想要改变一个SceneActor的归属，请使用`SceneActor`下的`changeParent`方法。
   */
  public removeChild(actor: Actor) {
    if (!actor.parent || !isChildActorComponent(actor.parent)) {
      return;
    }

    this.removeComponent(actor.parent);
  }

  // todo: 级联将导致所有子组件递归销毁
  // 性能会不会有问题？
  // 这个情况还要考虑更完美的处理方式？
  protected clearSceneComponent(component: SceneComponent) {
    component.children.forEach(child => {
      component.destroy();
      this._components.remove(child.name.value);

      this.clearSceneComponent(child);
    });
  }

  /**
   * 根据名字查找一个Component。
   */
  public findComponentByName<TComponent extends Component = Component>(
    name: string
  ): TComponent {
    return this._components.get<TComponent>(name);
  }

  /**
   * 根据某个类查找一个Component。
   */
  public findComponentByClass<TComponent extends Component = Component>(
    ComponentClass: TConstructor<TComponent>
  ): TComponent {
    return this._components.findByClass<TComponent>(ComponentClass);
  }

  /**
   * 查找某个类的所有实例Component。
   */
  public findComponentsByClass<TComponent extends Component = Component>(
    ComponentClass: TConstructor<TComponent>
  ): TComponent[] {
    return this._components.findAllByClass<TComponent>(ComponentClass);
  }

  /**
   * 通过一个Filter来查找组件。
   */
  public findComponentByFilter<TComponent extends Component = Component>(
    filter: (item: Component<any>) => boolean
  ): TComponent {
    return this._components.findByFilter<TComponent>(filter);
  }

  /**
   * 通过一个Filter来查找所有。
   */
  public findComponentsByFilter<TComponent extends Component = Component>(
    filter: (item: Component<any>) => boolean
  ): TComponent[] {
    return this._components.findAllByFilter<TComponent>(filter);
  }
}
