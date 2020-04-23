/**
 * @File   : SpotLightActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 3:09:56 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import SpotLightComponent, {ISpotLightComponentState} from '../Light/SpotLightComponent';

/**
 * [SpotLightComponent](../spotlightcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'SpotLightActor'})
export default class SpotLightActor extends SceneActor<
  ISpotLightComponentState,
  SpotLightComponent
> {
  public onCreateRoot(options: ISpotLightComponentState) {
    return this.addComponent<SpotLightComponent>('root', SpotLightComponent, options);
  }
}
