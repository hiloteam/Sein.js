/**
 * @File   : BSPMorphActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/9/2018, 10:19:46 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import BSPMorphComponent, {IBSPMorphComponentState} from '../BSP/BSPMorphComponent';
import SceneActor from '../Renderer/SceneActor';

/**
 * [BSPMorphComponent](../bspmorphcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPMorphActor'})
export default class BSPMorphActor extends SceneActor<IBSPMorphComponentState, BSPMorphComponent> {
  public onCreateRoot(options: IBSPMorphComponentState): BSPMorphComponent {
    return this.addComponent('root', BSPMorphComponent, options);
  }
}
