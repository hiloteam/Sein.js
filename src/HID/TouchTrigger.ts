/**
 * @File   : TouchTrigger.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 上午11:31:49
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import EventTrigger from '../Event/EventTrigger';
import {ITouchEvent} from '../types/Event';
import {TConstructor} from '../types/Common';

/**
 * 触摸相关HID触发器的接口。
 */
export interface ITouchTrigger extends TConstructor<EventTrigger<ITouchEvent>> {
  needPreventDefault: boolean;
  needStopPropagation: boolean;
}

/**
 * @hidden
 */
function createTouchTrigger(className: string, eventName: string): ITouchTrigger {
  @SClass({className})
  class TouchEventTrigger extends EventTrigger<ITouchEvent> {
    public static needPreventDefault = true;
    public static needStopPropagation = true;
    public isTouchEventTrigger = true;
    public autoFlush = false;

    public onBegin() {
      this.getGame().canvas.addEventListener(eventName, this.trigger);
    }

    public onTrigger(event: ITouchEvent) {
      if (TouchEventTrigger.needPreventDefault) {
        event.preventDefault();
      }

      if (TouchEventTrigger.needStopPropagation) {
        event.stopPropagation();
      }

      super.onTrigger(event);
    }

    public onPause() {
      this.getGame().canvas.removeEventListener(eventName, this.trigger);
    }
  }

  return TouchEventTrigger;
}

export const TouchStartTrigger = createTouchTrigger('TouchStartTrigger', 'touchstart');
export const TouchEndTrigger = createTouchTrigger('TouchEndTrigger', 'touchend');
export const TouchMoveTrigger = createTouchTrigger('TouchMoveTrigger', 'touchmove');
export const TouchCancelTrigger = createTouchTrigger('TouchCancelTrigger', 'touchcancel');
