/**
 * @File   : KeyboardTrigger.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/28 上午11:31:36
 * @Description:
 */
import {SClass} from '../Core/Decorator';
import EventTrigger from '../Event/EventTrigger';
import {IKeyboardEvent} from '../types/Event';
import {TConstructor} from '../types/Common';

/**
 * 键盘相关HID触发器的接口。
 */
export interface IKeyBoardEventTrigger extends TConstructor<EventTrigger<IKeyboardEvent>> {}

/**
 * @hidden
 */
function createKeyboardTrigger(className: string, eventName: string): IKeyBoardEventTrigger {
  @SClass({className})
  class KeyBoardEventTrigger extends EventTrigger<IKeyboardEvent> {
    public isKeyBoardEventTrigger = true;
    public autoFlush = false;

    public onBegin() {
      window.addEventListener(eventName, this.trigger);
    }

    public onTrigger(event: IKeyboardEvent) {
      if (className !== 'KeyDownTrigger') {
        event.preventDefault();
      }

      event.stopPropagation();

      super.onTrigger(event);
    }

    public onPause() {
      window.removeEventListener(eventName, this.trigger);
    }
  }

  return KeyBoardEventTrigger;
}

export const KeyDownTrigger = createKeyboardTrigger('KeyDownTrigger', 'keydown');
export const KeyPressTrigger = createKeyboardTrigger('KeyPressTrigger', 'keypress');
export const KeyUpTrigger = createKeyboardTrigger('KeyUpTrigger', 'keyup');
