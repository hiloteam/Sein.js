/**
 * @File   : OrthographicCameraActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/11/2018, 5:34:16 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import OrthographicCameraComponent, {IOrthographicCameraComponentState} from '../Camera/OrthographicCameraComponent';
import SceneActor from '../Renderer/SceneActor';

/**
 * [OrthographicCameraComponent](../orthographiccameracomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'OrthographicCameraActor'})
export default class OrthographicCameraActor<
  IStateTypes extends IOrthographicCameraComponentState = IOrthographicCameraComponentState
> extends SceneActor<
  IStateTypes,
  OrthographicCameraComponent<IStateTypes>
> {
  get camera() {
    return this._root;
  }

  public onCreateRoot(options: IStateTypes) {
    return this.addComponent<OrthographicCameraComponent<IStateTypes>>('root', OrthographicCameraComponent, options);
  }
}
