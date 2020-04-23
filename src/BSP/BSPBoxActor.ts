/**
 * @File   : BSPBoxActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/9/2018, 10:04:23 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import BSPBoxComponent, {IBSPBoxComponentState} from '../BSP/BSPBoxComponent';
import SceneActor from '../Renderer/SceneActor';

/**
 * [BSPBoxComponent](../bspboxcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'BSPBoxActor'})
export default class BSPBoxActor extends SceneActor<IBSPBoxComponentState, BSPBoxComponent> {
  public onCreateRoot(options: IBSPBoxComponentState): BSPBoxComponent {
    return this.addComponent('root', BSPBoxComponent, options);
  }
}
