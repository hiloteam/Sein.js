/**
 * @File   : WindowResizeTrigger.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 7:29:22 PM
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import EventTrigger from '../Event/EventTrigger';

/**
 * 窗口大小改变时的触发器。
 * 
 * @noInheritDoc
 */
@SClass({className: 'WindowResizeTrigger'})
export default class WindowResizeTrigger extends EventTrigger<never> {
  public isMouseEventTrigger = true;
  public autoFlush = false;

  public onBegin() {
    window.addEventListener('resize', this.trigger);
  }

  public onPause() {
    window.removeEventListener('resize', this.trigger);
  }
}
