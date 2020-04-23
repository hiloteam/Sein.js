/**
 * @File   : AmbientLightActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 8:15:10 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import AmbientLightComponent, {IAmbientLightComponentState} from '../Light/AmbientLightComponent';

/**
 * [AmbientLightComponent](../ambientlightcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'AmbientLightActor'})
export default class AmbientLightActor extends SceneActor<
  IAmbientLightComponentState,
  AmbientLightComponent
> {
  public onCreateRoot(options: IAmbientLightComponentState) {
    return this.addComponent<AmbientLightComponent>('root', AmbientLightComponent, options);
  }
}
