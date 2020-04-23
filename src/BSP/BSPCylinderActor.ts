/**
 * @File   : BSPCylinderActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/9/2018, 10:19:16 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import BSPCylinderComponent, {IBSPCylinderComponentState} from '../BSP/BSPCylinderComponent';
import SceneActor from '../Renderer/SceneActor';

/**
 * [BSPCylinderComponent](../bspcylindercomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPCylinderActor'})
export default class BSPCylinderActor extends SceneActor<IBSPCylinderComponentState, BSPCylinderComponent> {
  public onCreateRoot(options: IBSPCylinderComponentState): BSPCylinderComponent {
    return this.addComponent('root', BSPCylinderComponent, options);
  }
}
