/**
 * @File   : Game.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午5:23:05
 * @Description:
 */
import SObject from '../Core/SObject';
import Actor from '../Core/Actor';
import GameMode from '../Info/GameModeActor';
import LevelScriptActor from '../Info/LevelScriptActor';
import Engine from '../Core/Engine';
import World from '../Core/World';
import Level from '../Core/Level';
import EventManager from '../Event/EventManager';
import Hilo3d from '../Core/Hilo3d';
import {SClass} from '../Core/Decorator';
import ResourceManager from '../Resource/ResourceManager';
import {
  IGlobalDefaultLoaders,
  IGlobalHIDDefaultEvents, IGlobalDefaultEvents
} from '../types/Global';
import GlTFLoader from '../Resource/GlTFLoader';
import ImageLoader from '../Resource/ImageLoader';
import TextureLoader from '../Resource/TextureLoader';
import AtlasLoader from '../Resource/AtlasLoader';
import {TGameModeConstructor, TLevelScriptConstructor, TConstructor, IDeviceInfo} from '../types/Common';
import {
  KeyDownTrigger, KeyPressTrigger, KeyUpTrigger
} from '../HID/KeyboardTrigger';
import {
  TouchStartTrigger, TouchEndTrigger,
  TouchMoveTrigger, TouchCancelTrigger
} from '../HID/TouchTrigger';
import {
  MouseClickTrigger, MouseDownTrigger, MouseEnterTrigger,
  MouseLeaveTrigger, MouseMoveTrigger, MouseOutTrigger,
  MouseOverTrigger, MouseUpTrigger, MouseWheelTrigger, ContextMenuTrigger, WheelTrigger
} from '../HID/MouseTrigger';
import WindowResizeTrigger from '../HID/WindowResizeTrigger';
import BaseException from '../Exception/BaseException';
import throwException from '../Exception/throwException';
import BreakGuardException from '../Exception/BreakGuardException';
import MemberConflictException from '../Exception/MemberConflictException';
import UnmetRequireException from '../Exception/UnmetRequireException';
import SArray from '../DataStructure/SArray';
import Player from '../Player/Player';
import SMap from '../DataStructure/SMap';
import MissingMemberException from '../Exception/MissingMemberException';
import Ticker from '../Core/Ticker';
import SceneActor from '../Renderer/ISceneActor';
import InfoActor from '../Info/InfoActor';
import StateActor from '../Info/StateActor';
import PhysicSystemActor from '../Physic/PhysicSystemActor';
import CubeTextureLoader from '../Resource/CubeTextureLoader';
import Fog from '../Renderer/Fog';
import Debug from '../Debug';

/**
 * 游戏初始化配置。
 */
export interface IGameOptions {
  /**
   * 游戏视图容器。
   */
  canvas: HTMLCanvasElement;
  /**
   * 游戏容器宽度，默认为容器宽度。
   */
  width?: number;
  /**
   * 游戏容器高度，默认为容器高度。
   */
  height?: number;
  /**
   * 游戏容器像素密度，默认自动计算。
   */
  pixelRatio?: number;
  /**
   * 背景清除色，默认为`rgb(0, 0, 0)`。
   */
  clearColor?: Hilo3d.Color;
  /**
   * 是否使用Framebuffer，默认不开启。
   * 
   * @default false
   */
  useFramebuffer?: boolean;
  /**
   * framebuffer配置。
   * 
   * @default {}
   */
  framebufferOption?: any;
  /**
   * 是否使用对数深度，默认不开启。
   * 
   * @default false
   */
  useLogDepth?: boolean;
  /**
   * 是否开启透明背景，默认不开启。
   * 
   * @default false
   */
  alpha?: boolean;
  /**
   * 是否开启`depth test`，默认开启。
   * 
   * @default true
   */
  depth?: boolean;
  /**
   * 是否开启`stencil test`，默认不开启。
   * 
   * @default false
   */
  stencil?: boolean;
  /**
   * 是否开启抗锯齿，默认开启。
   * 
   * @default true
   */
  antialias?: boolean;
  /**
   * 是否使用instanced，默认不开启，仅在WebGL2.0有效。
   * 
   * @default false
   */
  useInstanced?: boolean;
  /**
   * 是否使用VAO，默认开启。
   * 
   * @default true
   */
  useVao?: boolean;
  /**
   * 是否开启预乘alpha，默认开启。
   * 
   * @default true
   */
  premultipliedAlpha?: boolean;
  /**
   * 是否在每一帧buffer渲染前不清除并保护它们的数据，默认不开启。
   * 
   * @default false
   */
  preserveDrawingBuffer?: boolean;
  /**
   * 当性能低下的时候，是否要创建context。
   * 
   * @default false
   */
  failIfMajorPerformanceCaveat?: boolean;
  /**
   * 默认顶点着色器精度，针对原生的Basic和PBR等材质有效。
   * 
   * @default 'highp'
   */
  vertexPrecision?: 'highp' | 'mediump' | 'lowp';
  /**
   * 默认片段着色器精度，针对原生的Basic和PBR等材质有效。
   * 在移动端，为了兼容性，建议为`'mediump'`。
   * 
   * @default 'highp'
   */
  fragmentPrecision?: 'highp' | 'mediump' | 'lowp';
  /**
   * 雾
   */
  fog?: Fog;
  /**
   * 指定解压压缩模型时分配给WASM的内存页，每页64kB，如果超出了则会降级到JS解压。
   * 
   * @default 256
   */
  amcMemPages?: number;
  /**
   * 是否开启游戏模式，UC专用。
   */
  gameMode?: boolean;
}

/**
 * 判断一个实例是否为`Game`。
 */
export function isGame(value: SObject): value is Game {
  return (value as Game).isGame;
}

/**
 * 游戏类，整个Game逻辑中实际的顶层类，将作为一个单例存在于整个Game中，通常使用`getGame`获取。
 * 
 * @template IState Game的状态Actor类型，用于存储整个Game的全局状态。
 * @noInheritDoc
 */
@SClass({className: 'Game', classType: 'Game'})
export default class Game<
  IState extends StateActor = StateActor
> extends SObject {
  public isGame: boolean = true;
  /**
   * 当前的一些设备信息。
   */
  public deviceInfo: IDeviceInfo = {
    touchable: !!(window && ('ontouchstart' in window))
  };

  protected _engine: Engine = null;
  private _resource: ResourceManager<IGlobalDefaultLoaders> = null;
  protected _event: EventManager<IGlobalDefaultEvents> = null;
  protected _hid: EventManager<IGlobalHIDDefaultEvents> = null;
  protected _initState: IState;
  protected _state: IState;
  protected _worldsMeta: {
    [name: string]: {
      GameMode: TGameModeConstructor<GameMode>,
      levels: {
        [name: string]: {
          Script: TLevelScriptConstructor<LevelScriptActor>
        }
      }
    }
  } = {};
  protected _defaultWorldName: string = null;
  protected _world: World = null;
  protected _actors: SArray<InfoActor> = new SArray();
  protected _actorsForUpdate: SArray<Actor> = new SArray();
  protected _actorsNeedUpdate: boolean = false;
  protected _actorsPriorities: number[] = [];
  protected _actorsPriorityCount: {[priority: number]: number} = {};
  protected _players: SMap<Player> = new SMap();
  protected _defaultPlayer: string = null;
  protected _paused: boolean = true;

  private _hiloStage: Hilo3d.Stage = null;

  /**
   * @param StateClass 游戏全局状态实例的类
   * @param initState 游戏全局状态实例的初始值，若存在，将在初始化时从它clone
   */
  constructor(
    name: string,
    options: IGameOptions,
    StateClass: TConstructor<IState> = StateActor as any,
    initState: IState = null
  ) {
    super(name);

    this._initState = initState;

    this._hiloStage = new Hilo3d.Stage(options);
    this._hiloStage.needCallChildUpdate = false;
    this._resource = new ResourceManager(this);
    this._event = new EventManager(this);
    this._hid = new EventManager(this);
    this._state = this.addActor('game-state', StateClass);
    this._state.copy(this._initState);

    this.canvas.style.width = '';
    this.canvas.style.height = '';

    this.initEvents();
    this.initLoaders(options);
    this.initSystems();

    try {
      this.onInit();
    } catch (error) {
      throwException(error, this);
    }

    this._event.trigger('GameDidInit', {game: this});
  }

  /**
   * Game状态Actor实例引用。
   */
  get state() {
    return this._state;
  }

  /**
   * Game全局事件管理器实例引用。
   * 默认事件列表见[IGlobalDefaultEvents](../interfaces/iglobaldefaultevents`)。
   */
  get event() {
    return this._event;
  }

  /**
   * Game全局HID管理器全局实例引用。
   * 这实际上是一个特化过的事件管理器，默认事件列表见[IGlobalHIDDefaultEvents](../interfaces/iglobalhiddefaultevents`)。
   */
  get hid() {
    return this._hid;
  }

  /**
   * 当前Game锁帧帧率。
   */
  get fps() {
    return this._engine.options.fps;
  }

  /**
   * 当前游戏是否处于暂停状态。
   */
  get paused() {
    return this._paused;
  }

  /**
   * Game的父级引擎实例引用。
   */
  get parent() {
    return this._engine;
  }

  /**
   * @hidden
   */
  get game(): Game<IState> {
    return this;
  }

  /**
   * 当前`World`实例引用。一般不直接使用，而是用`actor.getWorld()`或`component.getWorld`，提供更好的泛型类型推断。
   */
  get world(): World {
    return this._world;
  }

  /**
   * 当前`Level`实例引用。一般不直接使用，而是用`actor.getLevel()`或`component.getLevel`，提供更好的泛型类型推断。
   */
  get level(): Level {
    return this._world.level;
  }

  /**
   * 当前的玩家列表，要结合玩家系统，详见[Player](./player)。
   */
  get players() {
    return this._players;
  }

  /**
   * 当前`Game`实例下的所有Actor列表，注意列表中的`Actor`必须为`InfoActor`，单纯负责逻辑而没有`transform`。
   * 如果你需要实际上可视的Actor的列表，请参考`world.actors`。
   */
  get actors(): SArray<InfoActor> {
    return this._actors;
  }

  /**
   * Game的全局资源管理器实例引用，用于加载和管理所有的Game资源。
   */
  get resource() {
    return this._resource;
  }

  /**
   * Game的全局Ticker，来自`Engine`类，所有Game共用。
   */
  get ticker(): Ticker {
    return this._engine.ticker;
  }

  /**
   * 当前的`canvas`实例引用。
   */
  get canvas() {
    return this._hiloStage.canvas;
  }

  /**
   * 当前视口的实际像素宽度。
   */
  get screenWidth() {
    return this.canvas.offsetWidth;
  }

  /**
   * 当前视口的实际像素高度。
   */
  get screenHeight() {
    return this.canvas.offsetHeight;
  }

  /**
   * 当前视口的实际边界属性。
   */
  get bound() {
    return this.canvas.getBoundingClientRect();
  }

  /**
   * 当前视口实际的纵横比。
   */
  get screenAspect() {
    const {offsetWidth, offsetHeight} = this.canvas;

    return offsetWidth / offsetHeight;
  }

  /**
   * 当前运行环境，一般为`development`或`production`。
   */
  get env() {
    return Debug.env;
  }

  /**
   * `env`不为`production`时，判定为开发环境。
   */
  get devMode() {
    return Debug.devMode;
  }

  /**
   * @hidden
   */
  get renderer(): Hilo3d.WebGLRenderer {
    return this._hiloStage.renderer;
  }

  /**
   * @hidden
   */
  get hiloStage(): Hilo3d.Stage {
    return this._hiloStage;
  }

  /**
   * @hidden
   */
  public getGame(): Game<IState> {
    return this;
  }

  /**
   * 获取全局事件管理器引用。
   */
  public getEvent<IEvents extends IGlobalDefaultEvents = IGlobalDefaultEvents>(): EventManager<IEvents> {
    return this._event as EventManager<IEvents>;
  }

  /**
   * 获取全局HID管理器引用。
   */
  public getHID<IHIDs extends IGlobalHIDDefaultEvents = IGlobalHIDDefaultEvents>(): EventManager<IHIDs> {
    return this._hid as EventManager<IHIDs>;
  }

  /**
   * 获取全局资源管理器引用。
   */
  public getResource<IEntities extends IGlobalDefaultLoaders = IGlobalDefaultLoaders>(): ResourceManager<IEntities> {
    return this._resource as ResourceManager<IEntities>;
  }

  /**
   * 设定特定渲染配置。
   */
  public setOption<TKey extends keyof IGameOptions>(key: TKey, value: IGameOptions[TKey]) {
    this._hiloStage.renderer[key as string] = value;
    this._initState[key as string] = value;
  }

  /**
   * 获取特定渲染配置。
   */
  public getOption<TKey extends keyof IGameOptions>(key: TKey): IGameOptions[TKey] {
    return this._initState[key as string];
  }

  /**
   * 生命周期，在Game初始化时被触发。
   * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
   */
  public onInit() {

  }

  /**
   * 生命周期，在Game被添加到引擎成功后被触发。
   * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
   */
  public onAdd() {

  }

  /**
   * 生命周期，在Game启动后被处罚。
   * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
   */
  public onStart() {

  }

  /**
   * 生命周期，在Game被暂停前触发。
   * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
   */
  public onPause() {

  }

  /**
   * 生命周期，在Game被唤醒后触发。
   * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
   */
  public onResume() {

  }

  /**
   * 生命周期，用于错误边界处理。将在Game中大部分可预知错误发生时被调用（通常是生命周期中的非异步错误）。
   * 错误将会根据一定的路径向上传递，一直到`Engine`的层次，你可以在确保完美处理了问题后返回`true`来通知引擎不再向上传递。
   * 当然你也可以将自定义的一些错误加入错误边界机制中，详见[Exception](../../guide/exception)。
   */
  public onError(error: BaseException, details?: any): boolean | void {

  }

  /**
   * 生命周期，在Game每一帧更新时被触发。
   * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
   */
  public onUpdate(delta: number) {

  }

  /**
   * 生命周期，在Game销毁时被触发。
   * 大部分Game生命周期都有其对应的全局方法，建议在`game.event`中去监听使用。
   */
  public onDestroy() {

  }

  /**
   * 向Game类添加一个`World`。
   * 
   * @param GameMode 承载World逻辑的Actor，需继承自`GameModeActor`，此World所有的Level都将共有这一个GameMode。
   * @param PersistentLevelScript World至少有一个默认的Level，在添加World时必须指定一个入口Level。
   * @param isDefault 此World是否是游戏默认的World，在游戏开始前至少有一个默认的World。
   */
  public addWorld<
    TGameModeClass extends GameMode<any>,
    TPersistentLevelScriptClass extends LevelScriptActor<any>,
  >(
    name: string,
    GameMode: TGameModeConstructor<TGameModeClass>,
    PersistentLevelScript: TLevelScriptConstructor<TPersistentLevelScriptClass>,
    isDefault: boolean = false
  ) {
    this._worldsMeta[name] = {
      GameMode,
      levels: {
        persistent: {
          Script: PersistentLevelScript
        }
      }
    };

    if (isDefault || Object.keys(this._worldsMeta).length < 2) {
      this._defaultWorldName = name;
    }

    return this;
  }

  /**
   * 从Game类中移除一个`World`。
   * 
   * 注意不能移除当前正在运作的World。
   */
  public removeWorld(name: string) {
    if (this._world.name.equalsTo(name)) {
      throw new BreakGuardException(this, `World ${name} is running could not be removed !`);
    }

    this._world.destroy();
    delete this._worldsMeta[name];

    return this;
  }

  /**
   * 切换当前正在运行的`World`。
   * 
   * @param initState 如果需要，指定初始化状态，将会被clone，传`null`则没有效果。
   * @param needInheritActors 是否需要从上一个World继承Actors。
   */
  public async switchWorld(
    name: string,
    initState: StateActor = null,
    needInheritActors: boolean = false
  ) {
    if (!this._worldsMeta[name]) {
      throw new MissingMemberException(this, 'World', name, this);
    }

    let inheritActors: SArray<SceneActor>;
    const oldWorld = this._world;

    // todo: inherit actors from pre world
    if (oldWorld) {
      inheritActors = oldWorld.destroy(!needInheritActors);
    }

    const {GameMode, levels} = this._worldsMeta[name];

    this._world = new World(name, GameMode, levels, this);
    await this._world.init(initState);

    if (inheritActors && needInheritActors) {
      await this._world.switchLevel('persistent', null, inheritActors);
    } else {
      await this.switchLevel('persistent');
    }
  }

  /**
   * 向指定World添加一个`Level`。
   * 
   * @param Script 承载Level逻辑的Actor，需继承自`LevelScriptActor`。
   */
  public addLevel<TLevelScriptClass extends LevelScriptActor<any>>(
    worldName: string,
    levelName: string,
    Script: TLevelScriptConstructor<TLevelScriptClass>
  ) {
    if (!this._worldsMeta[worldName]) {
      throw new MissingMemberException(this, 'World', worldName, this);
    }

    if (this._worldsMeta[worldName].levels[levelName]) {
      throw new MemberConflictException(this, `Level of world ${worldName}`, levelName, this);
    }

    this._worldsMeta[worldName].levels[levelName] = {Script};

    return this;
  }

  /**
   * 从指定World中移除一个`Level`。
   */
  public removeLevel(worldName: string, levelName: string) {
    if (!this._worldsMeta[worldName]) {
      return;
    }

    if (this._world.name.equalsTo(worldName) && this.level.name.equalsTo(levelName)) {
      throw new BreakGuardException(this, `Level ${worldName} in world ${this._world.name} is running could not be removed !`);
    }

    delete this._worldsMeta[worldName].levels[levelName];

    return this;
  }

  /**
   * 切换当前World中运行的`Level`。
   * 注意Level之间的actors是会默认进入继承逻辑的。
   */
  public switchLevel(name: string, initState: any = null) {
    return this._world.switchLevel(name, initState);
  }

  /**
   * 通过指定的InfoActor类`ActorClass`和初始化参数`initOptions`，向Game中添加一个actor。
   * 注意继承自`SceneActor`或根组件为`SceneComponent`的Actor应当被添加到`World`中，而不是`Game`中。
   */
  public addActor<TActor extends InfoActor<any, any>>(
    name: string,
    ActorClass: TConstructor<TActor>,
    initOptions?: TActor['OPTIONS_TYPE']
  ): TActor {
    const actor = new ActorClass(name, this, initOptions);

    if (this.devMode) {
      try {
        actor.verifyAdding(initOptions);
      } catch (error) {
        throwException(error, actor);
        return;
      }
    }

    actor.initialized();

    const {updatePriority} = actor;
    const priorities = this._actorsPriorities;
    const priorityCount = this._actorsPriorityCount;
    let count = priorityCount[updatePriority];

    if (updatePriority === InfoActor.UPDATE_PRIORITY.Others) {
      this._actors.add(actor);
    } else {
      const length = priorities.length;
      let index = 0;

      for (let i = 0; i < length; i += 1) {
        const p = priorities[i];

        if (updatePriority < p) {
          break;
        }

        index += priorityCount[p];
      }

      if (count === undefined) {
        count = 0;
        priorities.push(updatePriority);
        /**
         * @todo: change to insert sorting?
         */
        priorities.sort();
      }

      priorityCount[updatePriority] = count + 1;
      this._actors.insert(index, actor);
    }

    (actor as any)._parent = this;
    actor.added();

    this._actorsNeedUpdate = true;
    return actor;
  }

  /**
   * 从Game中移除一个actor。
   */
  public removeActor(actor: InfoActor) {
    actor.destroy();
    (actor as any)._parent = null;
    this._actors.remove(actor);

    const {updatePriority} = actor;
    const priorities = this._actorsPriorities;
    const priorityCount = this._actorsPriorityCount;
    let count = priorityCount[updatePriority];

    if (updatePriority !== InfoActor.UPDATE_PRIORITY.Others) {
      count -= 1;
    }

    if (count === 0) {
      delete priorityCount[count];
      priorities.splice(priorities.indexOf(updatePriority), 1);
    }

    this._actorsNeedUpdate = true;
    return this;
  }

  /**
   * 通过指定的玩家类`PlayerClass`，向Game中创建一个Player。
   * 要结合玩家系统，详见[Player](./player)。
   */
  public createPlayer<TPlayer extends Player = Player>(
    name: string,
    PlayerClass?: TConstructor<TPlayer>,
    isDefault: boolean = false
  ): TPlayer {
    if (PlayerClass) {
      this._players.set(name, new PlayerClass(name, this));
    } else {
      this._players.set(name, new Player(name, this));
    }

    if (isDefault || this._players.empty) {
      this._defaultPlayer = name;
    }

    return this._players.get(name);
  }

  /**
   * 获取一个指定的Player实例引用。
   */
  public getPlayer(name?: string) {
    if (!name && this._defaultPlayer) {
      name = this._defaultPlayer;
    }

    return this._players.get(name);
  }

  /**
   * 移除一个指定的Player。
   */
  public removePlayer(name: string) {
    const player = this._players.remove(name);
    player.releaseController();

    return this;
  }

  /**
   * 清空Player列表。
   */
  public clearPlayers() {
    this._players.forEach(player => {
      player.releaseController();
    });

    this._players.clear();

    return this;
  }

  protected initLoaders(options: IGameOptions) {
    this._resource.register('GlTF', GlTFLoader);
    this._resource.register('Image', ImageLoader);
    this._resource.register('Texture', TextureLoader);
    this._resource.register('CubeTexture', CubeTextureLoader);
    this._resource.register('Atlas', AtlasLoader);

    if (options.amcMemPages) {
      (GlTFLoader.GET_EXTENSION_HANDLER('ALI_amc_mesh_compression') as any).memPages = options.amcMemPages;
    }
  }

  protected initEvents() {
    this._hid.register('MouseClick', MouseClickTrigger);
    this._hid.register('MouseDown', MouseDownTrigger);
    this._hid.register('MouseEnter', MouseEnterTrigger);
    this._hid.register('MouseLeave', MouseLeaveTrigger);
    this._hid.register('MouseMove', MouseMoveTrigger);
    this._hid.register('MouseOut', MouseOutTrigger);
    this._hid.register('MouseOver', MouseOverTrigger);
    this._hid.register('MouseUp', MouseUpTrigger);
    this._hid.register('MouseWheel', MouseWheelTrigger);
    this._hid.register('Wheel', WheelTrigger);
    this._hid.register('ContextMenu', ContextMenuTrigger);
    this._hid.register('KeyDown', KeyDownTrigger);
    this._hid.register('KeyUp', KeyUpTrigger);
    this._hid.register('KeyPress', KeyPressTrigger);
    this._hid.register('TouchStart', TouchStartTrigger);
    this._hid.register('TouchEnd', TouchEndTrigger);
    this._hid.register('TouchMove', TouchMoveTrigger);
    this._hid.register('TouchCancel', TouchCancelTrigger);

    this._event.register('Resize', WindowResizeTrigger);
    this._event.register('GameDidInit');
    this._event.register('GameDidStart');
    this._event.register('GameWillPause');
    this._event.register('GameDidResume');
    this._event.register('GameWillDestroy');
    this._event.register('WorldDidInit');
    this._event.register('WorldDidCreatePlayers');
    this._event.register('WorldWillDestroy');
    this._event.register('LevelDidInit');
    this._event.register('LevelWillPreload');
    this._event.register('LevelIsPreloading');
    this._event.register('LevelDidPreload');
    this._event.register('LevelDidCreateActors');
    this._event.register('LevelWillDestroy');
    this._event.register('WebglContextLost');
    this._event.register('WebglContextRestored');
    this._event.register('MainRendererWillStart');
    this._event.register('MainRendererIsCleared');
    this._event.register('MainRendererIsFinished');

    (this._hiloStage.renderer as any).on('webglContextLost', () => this._event.trigger('WebglContextLost'));
    (this._hiloStage.renderer as any).on('webglContextRestored', () => this._event.trigger('WebglContextRestored'));
    (this._hiloStage.renderer as any).on('beforeRenderScene', () => this._event.trigger('MainRendererIsCleared'));

    this.event.add('Resize', () => this.resize());
  }

  protected initSystems() {
    this.game.addActor('physicSystem', PhysicSystemActor);
  }

  /**
   * 重置画布容器尺寸。
   */
  public resize(bound?: {width: number, height: number}) {
    bound = bound || this.bound;
    const {width, height} = bound;
    const {pixelRatio, renderer} =  this._hiloStage;

    (this._hiloStage as any).width = width;
    (this._hiloStage as any).height = height;
    renderer.resize(width * pixelRatio, height * pixelRatio, true);

    if (this.world) {
      setTimeout(() => this.world.resizeMainCamera(), 0);
    }

    return this;
  }

  /**
   * 启动这个游戏。
   */
  public async start() {
    if (!this._defaultWorldName) {
      throw new UnmetRequireException(this, 'A default world must be specified !');
    }

    this.resize();

    await this.switchWorld(this._defaultWorldName);

    // destroyed
    if (!this._engine) {
      return this;
    }

    this._engine.startGame(this);
    this._paused = false;

    this._event.trigger('GameDidStart', {game: this});

    return this;
  }

  /**
   * 暂停这个游戏。
   */
  public pause() {
    if (this._paused) {
      return;
    }

    this._event.trigger('GameWillPause', {game: this});
    this._engine.pauseGame(this);
    this._paused = true;

    return this;
  }

  /**
   * 唤醒这个游戏。
   */
  public resume() {
    if (!this._paused) {
      return;
    }

    this._engine.resumeGame(this);
    this._paused = false;
    this._event.trigger('GameDidResume', {game: this});

    return this;
  }

  /**
   * 销毁这个游戏。
   */
  public destroy() {
    super.destroy();
    this._paused = true;

    this._event.trigger('GameWillDestroy', {game: this});

    this._engine.destroyGame(this);
    this._engine = null;
    this._hid.destroy();
    this._event.destroy();
    this._world.destroy();
    this.removeActor(this._state);

    this._actors.forEach(actor => actor.destroy());
    this._actors.clear();

    this._hiloStage.destroy();
    this._resource.destroy();
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public update(delta: number) {
    this._hid.flushAll();
    this._event.flushAll();

    try {
      this.onUpdate(delta);
    } catch (error) {
      throwException(error, this);
    }

    if (this._actorsNeedUpdate) {
      this._actorsForUpdate.copy(this._actors);
      this._actorsNeedUpdate = false;
    }

    this._actorsForUpdate.forEach(actor => actor.update(delta));

    this._players.forEach(player => player.update(delta));

    if (this.world) {
      this.world.update(delta);
    }
  }
}
