/**
 * @File   : SkeletalMeshActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/14/2018, 5:11:46 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import SkeletalMeshComponent, {ISkeletalMeshComponentState} from '../Renderer/SkeletalMeshComponent';

/**
 * [SkeletalMeshComponent](../skeletalmeshcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'SkeletalMeshActor', classType: 'Primitive'})
export default class SkeletalMeshActor<
  IStateTypes extends ISkeletalMeshComponentState = ISkeletalMeshComponentState
> extends SceneActor<
  IStateTypes,
  SkeletalMeshComponent<IStateTypes>
> {
  public onCreateRoot(options: IStateTypes) {
    return this.addComponent<SkeletalMeshComponent<IStateTypes>>('root', SkeletalMeshComponent, options);
  }
}
