/**
 * @File   : ChildActorComponent.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/29/2018, 2:20:50 PM
 * @Description:
 */
import Component from '../Core/Component';
import Actor from '../Core/Actor';
import SceneActor, {isSceneActor} from '../Renderer/ISceneActor';
import SObject from '../Core/SObject';
import {SClass} from './Decorator';
import {isSceneComponent} from '../Renderer/ISceneComponent';

/**
 * ChildActorComponent的初始化参数。
 * 
 * @template TActor 要挂载的子级Actor的类型。
 */
export interface IChildActorComponentState<TActor extends Actor = Actor> {
  /**
   * 要挂载的子级Actor。如果Actor已经有父级，将先将其从父级卸载。
   */
  actor: TActor;
  /**
   * 可选，挂载到某个组件下，一般用于挂载`SceneActor`到`SceneComponent`下。
   * 
   * @default owner
   */
  parent?: Component;
}

/**
 * 判断一个实例是否为`ChildActorComponent`。
 */
export function isChildActorComponent(value: SObject): value is ChildActorComponent {
  return (value as ChildActorComponent).isChildActorComponent;
}

/**
 * 用于给一个Actor挂载一个子级Actor的组件。
 * 注意此组件仅仅是建立了渲染层以及逻辑上的父子关系，但子级Actor仍然存在于`Game`或者`World`中，并不按照bfs顺序更新。
 * 
 * @template TActor 要挂载的子级Actor的类型。
 * @noInheritDoc
 */
@SClass({className: 'ChildActorComponent'})
export default class ChildActorComponent<TActor extends Actor = Actor> extends Component<IChildActorComponentState<TActor>> {
  public isChildActorComponent = true;
  /**
   * 声明通过该Component挂载的Actor是否随着父级的销毁而自动销毁。
   * 没有十足把握请不要修改！
   * 若想变更Actor的父级，请使用`SceneActor`下的`changeParent`方法。
   */
  public autoDestroyActor: boolean = true;

  protected _actor: TActor;
  protected _parent: Actor | Component;
  protected _owner: Actor;

  /**
   * 挂载的Actor的引用。
   */
  get actor(): TActor {
    return this._actor;
  }

  /**
   * @hidden
   */
  public onInit(initState: IChildActorComponentState<TActor>) {
    this._actor = initState.actor;
    this._parent = initState.parent || this.getRoot();

    if (!isSceneActor(this._actor) || !isSceneComponent(this._parent)) {
      return;
    }

    this._actor.root.hiloNode.removeFromParent();
    (this._actor as any)._parent = this;
    this._parent.hiloNode.addChild(this._actor.root.hiloNode);
  }

  /**
   * @hidden
   */
  public onDestroy() {
    if (!this._actor) {
      return;
    }

    (this._actor as any)._parent = null;

    if (isSceneActor(this._actor)) {
      this._actor.root.hiloNode.removeFromParent();

      if (this.autoDestroyActor) {
        this.getWorld().removeActor(this._actor);
      }
    } else {
      if (this.autoDestroyActor) {
        this.getGame().removeActor(this._actor as any);
      }
    }
  }

  /**
   * @hidden
   */
  public removeActor(actor: SceneActor) {
    this.removeFromParent();
  }
}
