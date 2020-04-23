/**
 * @File   : MeshActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 上午11:21:10
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SceneActor from '../Renderer/SceneActor';
import StaticMeshComponent, {IStaticMeshComponentState} from '../Renderer/StaticMeshComponent';

/**
 * [StaticMeshComponent](../staticmeshcomponent)的一个包装容器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'StaticMeshActor'})
export default class StaticMeshActor<
  IStateTypes extends IStaticMeshComponentState = IStaticMeshComponentState
> extends SceneActor<
  IStateTypes,
  StaticMeshComponent<IStateTypes>
> {
  public onCreateRoot(options: IStateTypes) {
    return this.addComponent<StaticMeshComponent<IStateTypes>>('root', StaticMeshComponent, options);
  }
}
