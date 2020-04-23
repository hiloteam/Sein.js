/**
 * @File   : PerspectiveCameraActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 下午1:50:02
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import PerspectiveCameraComponent, {IPerspectiveCameraComponentState} from '../Camera/PerspectiveCameraComponent';
import SceneActor from '../Renderer/SceneActor';

/**
 * [PerspectiveCameraComponent](../perspectivecameracomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'PerspectiveCameraActor'})
export default class PerspectiveCameraActor<
  IStateTypes extends IPerspectiveCameraComponentState = IPerspectiveCameraComponentState
> extends SceneActor<
  IStateTypes,
  PerspectiveCameraComponent<IStateTypes>
> {
  get camera() {
    return this._root;
  }

  public onCreateRoot(options: IStateTypes) {
    return this.addComponent<PerspectiveCameraComponent<IStateTypes>>('root', PerspectiveCameraComponent, options);
  }
}
