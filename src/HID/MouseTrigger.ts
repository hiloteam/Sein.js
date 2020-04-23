/**
 * @File   : MouseTrigger.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 上午11:31:25
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import EventTrigger from '../Event/EventTrigger';
import {IMouseEvent} from '../types/Event';
import {TConstructor} from '../types/Common';

/**
 * 鼠标相关HID触发器的接口。
 */
export interface IMouseEventTrigger extends TConstructor<EventTrigger<IMouseEvent>> {}

/**
 * @hidden
 */
function createMouseTrigger(className: string, eventName: string): IMouseEventTrigger {
  @SClass({className})
  class MouseEventTrigger extends EventTrigger<IMouseEvent> {
    public isMouseEventTrigger = true;
    public autoFlush = false;

    public onBegin() {
      this.getGame().canvas.addEventListener(eventName, this.trigger);
    }

    public onTrigger(event: IMouseEvent) {
      event.preventDefault();
      event.stopPropagation();

      super.onTrigger(event);
    }

    public onPause() {
      this.getGame().canvas.removeEventListener(eventName, this.trigger);
    }
  }

  return MouseEventTrigger;
}

export const MouseClickTrigger = createMouseTrigger('MouseClickTrigger', 'click');
export const MouseDownTrigger = createMouseTrigger('MouseDownTrigger', 'mousedown');
export const MouseUpTrigger = createMouseTrigger('MouseUpTrigger', 'mouseup');
export const MouseEnterTrigger = createMouseTrigger('MouseEnterTrigger', 'mouseenter');
export const MouseLeaveTrigger = createMouseTrigger('MouseLeaveTrigger', 'mouseleave');
export const MouseMoveTrigger = createMouseTrigger('MouseMoveTrigger', 'mousemove');
export const MouseOutTrigger = createMouseTrigger('MouseOutTrigger', 'mouseout');
export const MouseOverTrigger = createMouseTrigger('MouseOverTrigger', 'mouseover');
export const MouseWheelTrigger = createMouseTrigger('MouseWheelTrigger', 'mousewheel');
export const WheelTrigger = createMouseTrigger('WheelTrigger', 'wheel');
export const ContextMenuTrigger = createMouseTrigger('ContextMenuTrigger', 'contextmenu');
