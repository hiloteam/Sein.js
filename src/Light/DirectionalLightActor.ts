/**
 * @File   : DirectionalLightActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 3:09:28 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import DirectionalLightComponent, {IDirectionalLightComponentState} from '../Light/DirectionalLightComponent';

/**
 * [DirectionalLightComponent](../directionallightcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'DirectionalLightActor'})
export default class DirectionalLightActor extends SceneActor<
  IDirectionalLightComponentState,
  DirectionalLightComponent
> {
  public onCreateRoot(options: IDirectionalLightComponentState) {
    return this.addComponent<DirectionalLightComponent>('root', DirectionalLightComponent, options);
  }
}
