/**
 * @File   : BSPSphereActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/9/2018, 10:20:15 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import BSPSphereComponent, {IBSPSphereComponentState} from '../BSP/BSPSphereComponent';
import SceneActor from '../Renderer/SceneActor';

/**
 * [BSPSphereComponent](../bspspherecomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPSphereActor'})
export default class BSPSphereActor extends SceneActor<IBSPSphereComponentState, BSPSphereComponent> {
  public onCreateRoot(options: IBSPSphereComponentState): BSPSphereComponent {
    return this.addComponent('root', BSPSphereComponent, options);
  }
}
