/**
 * @File   : Level.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午5:23:35
 * @Description:
 */
import SObject from '../Core/SObject';
import LevelScriptActor from '../Info/LevelScriptActor';
import World from '../Core/World';
import Game from '../Core/Game';
import SceneActor from '../Renderer/ISceneActor';
import SceneComponent from '../Renderer/ISceneComponent';
import {TBound, TLevelScriptConstructor, TConstructor} from '../types/Common';
import {IResourceState} from '../types/Resource';
import {SClass} from '../Core/Decorator';
import BaseException from '../Exception/BaseException';
import throwException from '../Exception/throwException';
import SArray from '../DataStructure/SArray';
import StateActor from '../Info/StateActor';
import {Vector3} from '../Core/Math';
import Tween from './Tween';

/**
 * 判断一个实例是否为`Level`。
 */
export function isLevel(value: SObject): value is Level {
  return (value as Level).isLevel;
}

/**
 * 关卡类，单个关卡的逻辑容器，挂载在`World`下，也是存储`SceneActor`的实际容器，通常使用`getLevel`获取。
 * 一般来讲，我们不建议直接使用`Level`中的一些方法，而是使用`World`进行代理，更符合直觉。
 * 它的实际游戏逻辑由[LevelScriptActor](../levelscriptactor)描述。
 * 
 * @template IState Level的状态Actor类型，用于存储当前关卡的状态数据。
 * @noInheritDoc
 */
@SClass({className: 'Level', classType: 'Level'})
export default class Level<IState extends StateActor = StateActor> extends SObject {
  public isLevel: boolean = true;
  /**
   * 开放世界游戏，end用于无缝自动切换关卡，先占位，待完成
   */
  public bound: TBound = {
    start: new Vector3(0, 0, 0),
    end: null
  };

  protected _ScriptClass: TLevelScriptConstructor<LevelScriptActor<IState>>;
  protected _state: IState;
  protected _world: World = null;
  protected _actors: SArray<SceneActor> = new SArray();
  protected _actorsForUpdate: SArray<SceneActor> = new SArray();
  protected _actorsNeedUpdate: boolean = false;
  protected _script: LevelScriptActor = null;
  protected _updatable: boolean = false;

  /**
   * 创建Level，不要自己创建！
   * 
   * @hidden
   */
  constructor(
    name: string,
    LevelScript: TLevelScriptConstructor<LevelScriptActor<IState>>,
    world: World
  ) {
    super(name);
    this._world = world;

    this._ScriptClass = LevelScript;
  }

  /**
   * Level状态Actor实例引用。
   */
  get state() {
    return this._state;
  }

  /**
   * 当前`Game`实例引用。一般不直接使用，而是用`actor.getGame()`或`component.getGame`，提供更好的泛型类型推断。
   */
  get game(): Game {
    return this._world.game;
  }

  /**
   * 当前`World`实例引用。一般不直接使用，而是用`actor.getWorld()`或`component.getWorld`，提供更好的泛型类型推断。
   */
  get world(): World {
    return this._world;
  }

  /**
   * Level的父级World实例引用。
   */
  get parent() {
    return this._world;
  }

  /**
   * 当前所有的actors，建议使用`world.actors`获取。
   */
  get actors(): SArray<SceneActor> {
    return this._actors;
  }

  /**
   * 生命周期，用于错误边界处理。将在Game中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
   * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
   * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
   */
  public onError(error: BaseException, details?: any): boolean | void {
    return this._script.onError(error, details);
  }

  /**
   * 用于继承上个挂卡的actors，**不要自己调用！！**
   * 
   * @hidden
   */
  public inherit(inheritActors: SArray<SceneActor>) {
    this._actors.merge(inheritActors);

    inheritActors.forEach(actor => {
      if (isLevel(actor.parent)) {
        (actor as any)._parent = this;
      }
    });
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public async init(initState: IState) {
    this._script = this.game.addActor(`${this.name}-level-script`, this._ScriptClass);
    this._script.updateOnEverTick = false;

    this._state = this.game.addActor('level-state', this._ScriptClass.LevelStateClass);
    this._state.copy(initState);
    this._state.updateOnEverTick = false;

    (this._script as any)._parent = this;

    this._state.copy(initState);

    try {
      await this._script.onLogin();
    } catch (error) {
      throwException(error, this._script);
    }

    this._updatable = true;
    this.game.event.trigger('LevelDidInit', {level: this});
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public startLoading() {
    this.game.event.trigger('LevelWillPreload', {level: this});

    try {
      this._script.onPreload();
    } catch (error) {
      throwException(error, this._script);
    }

    if (this.game.resource.loadDone) {
      this.handleLoadDone();
      return;
    }

    this.game.resource.onLoading.add(this.handleLoading);
    this.game.resource.onError.add(this.handleLoadError);
    this.game.resource.onLoaded.addOnce(this.handleLoadDone);
  }

  private handleLoading = (params: IResourceState) => {
    try {
      this._script.onLoading(params);
    } catch (error) {
      throwException(error, this._script);
    }

    this.game.event.trigger('LevelIsPreloading', {level: this, state: params});
  }

  private handleLoadError = ({error, state}) => {
    throwException(error, this._script, state);
  }

  private handleLoadDone = () => {
    this.game.resource.onLoading.remove(this.handleLoading);
    this.game.resource.onError.remove(this.handleLoadError);

    this.game.event.trigger('LevelDidPreload', {level: this});

    try {
      this._script.onCreate();
    } catch (error) {
      throwException(error, this._script);
    }

    this._state.updateOnEverTick = true;
    this._script.updateOnEverTick = true;

    this.game.event.trigger('LevelDidCreateActors', {level: this});
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public update(delta: number) {
    if (!this._updatable) {
      return;
    }

    if (this._actorsNeedUpdate) {
      this._actorsForUpdate.copy(this._actors);
      this._actorsNeedUpdate = false;
    }

    this._actorsForUpdate.forEach(actor => actor.update(delta));
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public destroy(forceClear: boolean = false): SArray<SceneActor> {
    super.destroy();

    this.game.event.trigger('LevelWillDestroy', {level: this});

    /**
     * 销毁时同时取消所有资源加载逻辑。
     */
    this.game.resource.onLoading.remove(this.handleLoading);
    this.game.resource.onError.remove(this.handleLoadError);
    this.game.resource.onLoaded.remove(this.handleLoadDone);

    /**
     * 取消所有Tween动画。
     */
    Tween.removeAll();

    const inheritActors: SArray<SceneActor> = new SArray();

    if (!forceClear) {
      this._actorsForUpdate.forEach(actor => {
        if (actor.persistent) {
          inheritActors.add(actor);
        } else {
          actor.destroy();
        }
      });
    } else {
      this._actorsForUpdate.forEach(actor => {
        actor.destroy();
      });
    }

    // parent is not right, do not use removeFromParent
    this.game.removeActor(this._script);
    this.game.removeActor(this._state);

    return inheritActors;
  }

  /**
   * 通过指定的Actor类`ActorClass`和初始化参数`initOptions`，向Level中添加一个`SceneActor`。
   * 一般使用`world.addActor`进行代理。
   */
  public addActor<TActor extends SceneActor<any>>(
    name: string,
    ActorClass: TConstructor<TActor>,
    initOptions?: TActor['OPTIONS_TYPE'],
    parent?: SceneActor,
    parentComponent?: SceneComponent
  ): TActor {
    const actor = new ActorClass(name, this.game, initOptions);

    if (this.game.devMode) {
      try {
        actor.verifyAdding(initOptions);
      } catch (error) {
        throwException(error, actor);
        return;
      }
    }

    actor.initialized();

    this._actors.add(actor);

    if (!parent) {
      (actor as any)._parent = this;
    } else {
      parent.addChild(actor, parentComponent);
    }

    actor.added();
    this._actorsNeedUpdate = true;
    return actor;
  }

  /**
   * 从Level中移除一个SceneActor。
   * 一般使用`world.removeActor`进行代理。
   */
  public removeActor(actor: SceneActor) {
    // debugger;
    actor.destroy();
    (actor as any)._parent = null;
    this._actors.remove(actor);
    this._actorsNeedUpdate = true;

    return this;
  }
}
