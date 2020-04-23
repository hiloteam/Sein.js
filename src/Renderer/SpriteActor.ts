/**
 * @File   : SpriteActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/16/2018, 3:32:20 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import SpriteComponent, {ISpriteComponentState} from '../Renderer/SpriteComponent';

/**
 * [SpriteComponent](../spritecomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'SpriteActor'})
export default class SpriteActor<IStateTypes extends ISpriteComponentState = ISpriteComponentState> extends SceneActor<
  IStateTypes,
  SpriteComponent<IStateTypes>
> {
  public onCreateRoot(options: IStateTypes) {
    return this.addComponent<SpriteComponent<IStateTypes>>('root', SpriteComponent, options);
  }
}
