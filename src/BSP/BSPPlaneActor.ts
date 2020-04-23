/**
 * @File   : BSPPlaneActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/9/2018, 10:19:57 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import BSPPlaneComponent, {IBSPPlaneComponentState} from '../BSP/BSPPlaneComponent';
import SceneActor from '../Renderer/SceneActor';

/**
 * [BSPPlaneComponent](../bspplanecomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPPlaneActor'})
export default class BSPPlaneActor extends SceneActor<IBSPPlaneComponentState, BSPPlaneComponent> {
  public onCreateRoot(options: IBSPPlaneComponentState): BSPPlaneComponent {
    return this.addComponent('root', BSPPlaneComponent, options);
  }
}
