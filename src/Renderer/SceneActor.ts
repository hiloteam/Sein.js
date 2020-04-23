/**
 * @File   : SceneActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 下午1:53:17
 * @Description:
 */
import Actor from '../Core/Actor';
import Level, {isLevel} from '../Core/Level';
import {SClass} from '../Core/Decorator';
import SceneComponent, {isSceneComponent} from '../Renderer/SceneComponent';
import ChildActorComponent from '../Core/ChildActorComponent';
import AnimatorComponent from '../Animation/AnimatorComponent';
import RigidBodyComponent from '../Physic/RigidBodyComponent';
import ControllerActor from '../Player/ControllerActor';
import {Vector3} from '../Core/Math';
import {ISceneComponentState} from '../Renderer/ISceneComponent';
import ISceneActor from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';
import throwException from '../Exception/throwException';
import Layers from '../Renderer/Layers';
import World, {isWorld} from '../Core/World';
import * as Math from '../Core/Math';

/**
 * 判断一个实例是否为`SceneActor`。
 */
export function isSceneActor(value: SObject): value is SceneActor {
  return (value as SceneActor).isSceneActor;
}

/**
 * 场景Actor类，如果你想将一个`Actor`放入World(Level)，那么它必须为`SceneActor`。
 * 简而言之，这就是一个可以被赋予`transform`的Actor，它的根组件也必须为`SceneComponent`。
 * 
 * @template IOptionTypes 初始化参数类型，必须继承自[ISceneComponentState](../interfaces/iscenecomponentstate)。
 * @template TRootComponent 根级组件类型，必须继承自[ISceneComponent](../interfaces/iscenecomponent)。
 * @noInheritDoc
 */
@SClass({className: 'SceneActor'})
export default class SceneActor<
  IOptionTypes extends ISceneComponentState = ISceneComponentState,
  TRootComponent extends SceneComponent = SceneComponent
> extends Actor<
  IOptionTypes,
  TRootComponent
> implements ISceneActor<IOptionTypes, TRootComponent> {
  public isSceneActor: boolean = true;
  /**
   * 指定此实例是否为**持久的**，如果是，则此实例可以在关卡切换时被继承，或者在特殊状况时再世界切换时被继承。
   */
  public persistent: boolean = false;

  protected _root: TRootComponent;
  protected _rigidBody: RigidBodyComponent = null;
  protected _animator: AnimatorComponent = null;
  protected _controller: ControllerActor = null;
  protected _parent: Level | ChildActorComponent<SceneActor>;

  /**
   * 获取自身的父级实例，根据情况不同可能有不同的类型，一般不需要自己使用。
   */
  get parent(): Level | ChildActorComponent<SceneActor> {
    return this._parent;
  }

  /**
   * 获取自身的`transform`实例引用，本质上是根组件的一个代理。
   */
  get transform() {
    return this._root;
  }

  /**
   * 获取自身的刚体组件实例引用，需要开启物理引擎并初始化刚体，详见[RigidBodyComponent](../rigidbodycomponent)。
   */
  get rigidBody() {
    return this._rigidBody;
  }

  /**
   * 获取自身的动画组件实例引用，需要有模型动画或自己创建，详见[AnimatorComponent](../animatorcomponent)。
   */
  get animator() {
    return this._animator;
  }

  /**
   * 图层属性，详见[Layers](../layers)。
   */
  get layers(): Layers {
    return this._root.layers;
  }

  /**
   * 设置是否可见，代理到根组件的同属性。详见`SceneComponent`的同属性。
   */
  set visible(value: boolean) {
    this.root.visible = value;
  }

  /**
   * 获取是否可见，代理到根组件的同属性。详见`SceneComponent`的同属性。
   */
  get visible() {
    return this.root.visible;
  }

  /**
   * 设置是否为静态对象，代理到根组件的同属性。详见`SceneComponent`的同属性。
   */
  set isStatic(value: boolean) {
    this._root.isStatic = value;
  }

  /**
   * 获取是否为静态对象，代理到根组件的同属性。详见`SceneComponent`的同属性。
   */
  get isStatic(): boolean {
    return this._root.isStatic;
  }

  /**
   * 代理到根节点的同名属性，决定其下所有SceneComponent销毁时是否要同时释放Gl资源。
   */
  set needReleaseGlRes(value: boolean) {
    this._root.needReleaseGlRes = value;
  }

  /**
   * 代理到根节点的同名属性，决定其下所有SceneComponent销毁时是否要同时释放Gl资源。
   */
  get needReleaseGlRes() {
    return this._root.needReleaseGlRes;
  }

  /**
   * 生命周期，创建默认的`SceneComponent`根组件，可以覆盖。
   */
  public onCreateRoot(options: IOptionTypes): TRootComponent {
    return this.addComponent<SceneComponent>('root', SceneComponent, options) as TRootComponent;
  }

  /**
   * 专属于`SceneActor`的生命周期，一般用于从GlTF模型中实例化对象(使用`resource.instantiate`方法)的情景。
   * 如果不是从资源中实例化的，将按顺序正常触发。
   * 此回调将在真正完成实例化后被触发，时机在`onAdd`之后，确保实例已经完全就绪（包括世界矩阵的首次运算）。
   */
  public onInstantiate(options: IOptionTypes) {

  }

  /**
   * 取消链接，继承请先`super.onUnLink()`。
   */
  public onUnLink() {
    this._root.hiloNode.removeFromParent();
  }

  /**
   * 重新链接，继承请先`super.onReLink()`。
   */
  public onReLink(parent: SceneActor | World) {
    if (!isSceneActor(parent)) {
      this._root.hiloNode.addTo(parent.game.hiloStage);
    }
  }

  /**
   * 获取自身的`Controller`实例，涉及到玩家系统，详见[Player](./player)。
   */
  public getController<TController extends ControllerActor = ControllerActor>() {
    return this._controller as TController;
  }

  /**
   * 获取根组件的的包围盒(AABB)信息。
   * @param bounds 当前计算的包围盒信息，可用于节省开销
   * @param currentMatrix 当前计算的矩阵，可用于节省开销
   */
  public getBounds(bounds?: Math.Bounds, currentMatrix?: Math.Matrix4): Math.Bounds {
    return this._root.getBounds(bounds, currentMatrix);
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

    if (isLevel(this._parent)) {
      this._game.hiloStage.addChild(this._root.hiloNode);
    }

    this._components.forEach(component => {
      component.added();
    });

    try {
      this.onAdd(this._initOptions);
    } catch (error) {
      throwException(error, this);
    }

    if (!(this._initOptions && this._initOptions.__fromGlTF)) {
      this.instantiated();
    }
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public instantiated() {
    this._root.updateMatrixWorld(true);

    try {
      this.onInstantiate(this._initOptions);
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
    if (this._controller) {
      this._controller.dispossessActor();
    }

    if (this._parent && !isLevel(this._parent)) {
      this._parent.removeActor(this);
    }

    super.destroy();
  }

  /**
   * 修改自身的父级实例，通常用于Actor的复用。
   * **注意修改了之后自身的渲染节点也会重新挂载！**
   */
  public changeParent(parent: Level | World | SceneActor): this {
    const game = this._game;

    if (isLevel(parent) || isWorld(parent)) {
      if (isLevel(this._parent)) {
        return this;
      }

      this._parent.autoDestroyActor = false;
      this._parent.removeFromParent();
      game.hiloStage.addChild(this._root.hiloNode);
      this._parent = game.level;

      return this;
    }

    if (isLevel(this._parent)) {
      parent.addChild(this);

      return this;
    }

    this._parent.autoDestroyActor = false;
    this._parent.removeFromParent();
    parent.addChild(this);

    return this;
  }

  /**
   * 修改自身的朝向，直接代理到根组件的同名方法。
   */
  public lookAt(target: Vector3 | SceneActor | SceneComponent) {
    this._root.lookAt(target);

    return this;
  }

  /**
   * 进行一次预渲染，期间会处理Actor下所有Component的材质预编译、资源预提交等。
   */
  public preRender() {
    this._components.forEach(c => {
      if (isSceneComponent(c)) {
        c.preRender();
      }
    });
  }
}
