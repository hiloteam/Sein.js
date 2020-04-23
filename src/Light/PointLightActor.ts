/**
 * @File   : PointLightActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/16/2018, 3:09:42 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import PointLightComponent, {IPointLightComponentState} from '../Light/PointLightComponent';

/**
 * [PointLightComponent](../pointlightcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'PointLightActor'})
export default class PointLightActor extends SceneActor<
  IPointLightComponentState,
  PointLightComponent
> {
  public onCreateRoot(options: IPointLightComponentState) {
    return this.addComponent<PointLightComponent>('root', PointLightComponent, options);
  }
}
