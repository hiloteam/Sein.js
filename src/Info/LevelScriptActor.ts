/**
 * @File   : LevelScriptActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/29 上午10:08:53
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import {IResourceState} from '../types/Resource';
import InfoActor from '../Info/InfoActor';
import StateActor from '../Info/StateActor';
import {TConstructor} from '../types/Common';
import Level from '../Core/Level';
import World from '../Core/World';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`LevelScriptActor`。
 */
export function isLevelScriptActor(value: SObject): value is LevelScriptActor {
  return (value as LevelScriptActor).isLevelScriptActor;
}

/**
 * 游戏关卡逻辑Actor类。此类承载着一个`Level`的具体逻辑。
 * 
 * @template ILevelState 关卡状态参数类型。
 * 
 * @noInheritDoc
 */
@SClass({className: 'LevelScriptActor'})
export default class LevelScriptActor<ILevelState extends StateActor = StateActor> extends InfoActor {
  /**
   * 指定一个状态类，在此类所从属的`Level`实例化时，会由其生成默认的`LevelState`实例。
   */
  public static LevelStateClass: TConstructor<StateActor> = StateActor;

  public isLevelScriptActor: boolean = true;
  public readonly updatePriority = InfoActor.UPDATE_PRIORITY.LevelScript;

  /**
   * 此实例的父级实际指向`World`。
   */
  get parent(): World {
    return this._game.world;
  }

  /**
   * 获取当前`Level`的状态。
   */
  get state() {
    return this.getLevel<ILevelState>().state;
  }

  /**
   * 一个特殊的生命周期，在`onAdd`之后触发，只有在此生命周期内，你可以**执行阻塞的异步逻辑**。
   * 这个生命周期一般用于用户登录、获取异步状态等逻辑，谨慎使用！
   */
  public async onLogin() {

  }

  /**
   * 生命周期，在`onLogin`之后触发。
   * 这个生命周期用于关卡资源初始化，你也可以在这里直接创建一些Actor用于加载动画等。
   */
  public onPreload() {

  }

  /**
   * 生命周期，在`onPreload`之后、每一次资源加载进度更新时触发。
   * 你可以在这里更新你的家在进度。
   */
  public onLoading(state: IResourceState) {

  }

  /**
   * 生命周期，在`onLoading`结束之后触发。
   * 到了这个生命周期，所有的资源已经加载完毕就位，你可以执行实际上场景的创建了。
   */
  public onCreate() {

  }
}
