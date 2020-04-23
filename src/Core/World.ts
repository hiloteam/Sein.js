/**
 * @File   : World.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午5:23:29
 * @Description:
 */
import SObject, {isSObject} from '../Core/SObject';
import Game from '../Core/Game';
import Level from '../Core/Level';
import GameMode from '../Info/GameModeActor';
import LevelScriptActor from '../Info/LevelScriptActor';
import {SClass} from '../Core/Decorator';
import {TGameModeConstructor, TLevelScriptConstructor} from '../types/Common';
import SceneActor from '../Renderer/ISceneActor';
import CameraComponent, {isCameraComponent} from '../Camera/CameraComponent';
import BaseException from '../Exception/BaseException';
import {IPhysicWorld} from '../types/Physic';
import SArray from '../DataStructure/SArray';
import StateActor from '../Info/StateActor';
import UnmetRequireException from '../Exception/UnmetRequireException';
import {Vector3} from './Math';
import {isPerspectiveCameraComponent} from '../Camera/PerspectiveCameraComponent';
import {isOrthographicCameraComponent} from '../Camera/OrthographicCameraComponent';
import throwException from '../Exception/throwException';
import MissingMemberException from '../Exception/MissingMemberException';

/**
 * 判断一个实例是否为`World`。
 */
export function isWorld(value: SObject): value is World {
  return (value as World).isWorld;
}

/**
 * 世界类，单个世界的逻辑容器，挂载在`Game`下，通常使用`getWorld`获取。
 * 一般来讲，我们不建议直接使用`Level`中的一些方法，而是使用`World`进行代理，更符合直觉。
 * 它的实际游戏逻辑由[GameModeActor](../gamemodeactor)描述。
 * 
 * @template IState World的状态Actor类型，用于存储当前世界的状态数据。
 * @noInheritDoc
 */
@SClass({className: 'World', classType: 'World'})
export default class World<IState extends StateActor = StateActor> extends SObject {
  public isWorld: boolean = true;

  /**
   * 世界的up单位向量。
   */
  static get UP() {
    return new Vector3(0, 1, 0);
  }

  /**
   * 世界的down单位向量。
   */
  static get DOWN() {
    return new Vector3(0, -1, 0);
  }

  /**
   * 世界的right单位向量。
   */
  static get RIGHT() {
    return new Vector3(1, 0, 0);
  }

  /**
   * 世界的left单位向量。
   */
  static get LEFT() {
    return new Vector3(-1, 0, 0);
  }

  /**
   * 世界的forward单位向量。
   */
  static get FORWARD() {
    return new Vector3(0, 0, -1);
  }

  /**
   * 世界的back单位向量。
   */
  static get BACK() {
    return new Vector3(0, 0, 1);
  }

  /**
   * 代理到`level.addActor`。
   */
  public addActor: Level['addActor'];
  /**
   * 代理到`level.removeActor`。
   */
  public removeActor: Level['removeActor'];
  /**
   * 开启图层功能，若开启，可以通过给每个`Actor`指定`layers`，之后通过摄像机的`layers`来控制显示内容。
   * 详见示例**[Layers](../../example/renderer/layers)**。
   */
  public enableLayers: boolean = false;

  protected _GameModeClass: TGameModeConstructor<GameMode<IState>>;
  protected _state: IState;
  protected _game: Game = null;
  protected _script: GameMode = null;
  protected _level: Level = null;
  protected _levels: {
    [name: string]: {
      Script: TLevelScriptConstructor<LevelScriptActor>
    }
  } = {};
  protected _mainCamera: CameraComponent = null;
  // use for splitting screen mode, waiting.....
  protected _mainCameras: CameraComponent[] = [];
  protected _physicWorld: IPhysicWorld = null;
  protected _updatable: boolean = false;

  /**
   * 创建World，不要自己创建！
   * 
   * @hidden
   */
  constructor(
    name: string,
    GameMode: TGameModeConstructor<GameMode<IState>>,
    levels: {
      [name: string]: {
        Script: TLevelScriptConstructor<LevelScriptActor>
      }
    },
    game: Game
  ) {
    super(name);
    this._game = game;
    this._levels = levels;

    this._GameModeClass = GameMode;
  }

  /**
   * World状态Actor实例引用。
   */
  get state() {
    return this._state;
  }

  /**
   * 当前`Game`实例引用。一般不直接使用，而是用`actor.getGame()`或`component.getGame`，提供更好的泛型类型推断。
   */
  get game(): Game {
    return this._game;
  }

  /**
   * 当前`Level`实例引用。一般不直接使用，而是用`actor.getLevel()`或`component.getLevel`，提供更好的泛型类型推断。
   */
  get level(): Level {
    return this._level;
  }

  /**
   * Wolrd的父级Game实例引用。
   */
  get parent() {
    return this._game;
  }

  /**
   * 当前Level所有的actors，建议从这里获取。
   */
  get actors(): SArray<SceneActor> {
    return this._level.actors;
  }

  /**
   * 当前的摄像机组件实例引用。
   */
  get mainCamera(): CameraComponent {
    return this._mainCamera;
  }

  /**
   * 当前的物理世界实例引用，需要使用[enablePhysic](#enablephysic)开启后获取。
   */
  get physicWorld(): IPhysicWorld {
    return this._physicWorld;
  }

  /**
   * 当前世界的up单位向量。
   * 
   * @deprecated
   */
  get upVector() {
    return new Vector3(0, 1, 0);
  }

  /**
   * 当前世界的down单位向量。
   * 
   * @deprecated
   */
  get downVector() {
    return new Vector3(0, -1, 0);
  }

  /**
   * 当前世界的right单位向量。
   * 
   * @deprecated
   */
  get rightVector() {
    return new Vector3(1, 0, 0);
  }

  /**
   * 当前世界的left单位向量。
   * 
   * @deprecated
   */
  get leftVector() {
    return new Vector3(-1, 0, 0);
  }

  /**
   * 当前世界的forward单位向量。
   * 
   * @deprecated
   */
  get forwardVector() {
    return new Vector3(0, 0, -1);
  }

  /**
   * 当前世界的back单位向量。
   * 
   * @deprecated
   */
  get backVector() {
    return new Vector3(0, 0, 1);
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
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public async init(initState: IState) {
    this._script = this._game.addActor(`${this.name}-game-mode`, this._GameModeClass);
    this._script.updateOnEverTick = false;

    this._state = this._game.addActor('world-state', this._GameModeClass.WorldStateClass);
    this._state.copy(initState);
    this._state.updateOnEverTick = false;

    (this._script as any)._parent = this;

    this._state.copy(initState);
    this._game.event.trigger('WorldDidInit', {world: this});

    try {
      await this._script.onLogin();
    } catch (error) {
      throwException(error, this._script);
    }

    try {
      this._script.onCreatePlayers();
    } catch (error) {
      throwException(error, this._script);
    }

    this._game.event.trigger('WorldDidCreatePlayers', {world: this});

    if (this._game.players.length < 1) {
      throw new UnmetRequireException(this, 'You must give at least one player !');
    }

    this._script.updateOnEverTick = true;
    this._state.updateOnEverTick = true;

    this._updatable = true;
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

    if (this._level) {
      this._level.update(delta);
    }

    if (!this.mainCamera) {
      return;
    }

    this.mainCamera.render(null, true);
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public destroy(forceClear: boolean = true): SArray<SceneActor> {
    super.destroy();

    this._game.event.trigger('WorldWillDestroy', {world: this});

    try {
      this._script.onDestroyPlayers();
    } catch (error) {
      throwException(error, this._script);
    }

    const inheritActors = this._level.destroy(forceClear);

    // parent is not right, do not use removeFromParent
    this.game.removeActor(this._script);
    this.game.removeActor(this._state);

    if (this._physicWorld) {
      this._physicWorld.destroy();
    }

    this._game.players.forEach(player => {
      player.releaseController();
    });

    return inheritActors;
  }

  /**
   * 实际上的关卡切换逻辑，一般使用`game.switchLevel`进行代理。
   */
  public async switchLevel(
    name: string,
    initState: StateActor = null,
    // from world, for persistent level
    initActors?: SArray<SceneActor>
  ) {
    if (!this._levels[name]) {
      throwException(new MissingMemberException(this, 'Level', name, this), this);
    }

    let inheritActors: SArray<SceneActor>;

    const level = this._level;

    const {Script} = this._levels[name];
    this._level = new Level(name, Script, this);

    this.addActor = this._level.addActor.bind(this._level);
    this.removeActor = this._level.removeActor.bind(this._level);

    // 先销毁当前关卡
    if (level) {
      inheritActors = level.destroy();
    }

    // 再继承Actor
    this._level.inherit(inheritActors || initActors || new SArray());

    // 然后当前关卡的onInit/onAdd/onLogin
    await this._level.init(initState);

    // 最后加载资源
    this._level.startLoading();

    return this;
  }

  /**
   * 开启物理世界，具体使用见示例[Physic](../../example/physic/base)。
   * 
   * @enableContactEvents 是否要启用高级碰撞事件，这可以让你拥有对碰撞更细致的控制，但会有一些性能损耗，默认不开启。
   */
  public enablePhysic(physicWorld: IPhysicWorld, enableContactEvents: boolean = false) {
    this._physicWorld = physicWorld;

    if (enableContactEvents) {
      this._physicWorld.initContactEvents();
    }

    return this;
  }

  /**
   * 通过一个包含`camera`（`CameraComponent`）的容器来切换当前的主相机。
   */
  public setMainCamera(actorHasCamera: {camera: CameraComponent}): this;
  /**
   * 通过一个`CameraComponent`来切换当前的主相机。
   */
  public setMainCamera(cameraComponent: CameraComponent): this;
  public setMainCamera(obj: {camera: CameraComponent} | CameraComponent): this {
    if (this._mainCamera) {
      this._mainCamera.onAsMainCamera(false);
    }

    if (isSObject(obj) && isCameraComponent(obj)) {
      this._mainCamera = obj;
    } else {
      this._mainCamera = obj.camera;
    }

    this._mainCamera.onAsMainCamera(true);

    return this.resizeMainCamera();
  }

  /**
   * 重置当前摄像机相关的尺寸参数，一般不需要自己调用。
   */
  public resizeMainCamera(): this {
    if (!this._mainCamera) {
      return this;
    }

    const {width, height} = this._game.bound;
    const aspect = width / height;

    if (isPerspectiveCameraComponent(this._mainCamera)) {
      this._mainCamera.aspect = aspect;
      return this;
    }

    if (isOrthographicCameraComponent(this._mainCamera)) {
      this._mainCamera.top = this._mainCamera.right / aspect;
      this._mainCamera.bottom = -this._mainCamera.top;
    }

    return this;
  }

  /**
   * 移除当前世界的主摄像机引用，一般在主摄像机销毁时调用，比如关卡切换时。
   */
  public removeMainCamera() {
    this._mainCamera = null;
    this._mainCameras = [];
  }
}
