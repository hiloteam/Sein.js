/**
 * @File   : PhysicSystemActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/1/2019, 2:35:42 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import SystemActor from '../Info/SystemActor';

/**
 * 物理系统Actor，负责更新物理世界。
 * 
 * @hidden
 * @noInheritDoc
 */
@SClass({className: 'PhysicSystemActor'})
export default class PhysicSystemActor extends SystemActor {
  public isPhysicSystemActor = true;

  public onUpdate(delta: number) {
    const world = this.getWorld();

    if (world && world.physicWorld) {
      world.physicWorld.update(delta);
    }
  }
}
