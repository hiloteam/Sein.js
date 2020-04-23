# HID

HID，即用户接口设备，是指和用户输入的一切相关的设备，比如键盘、鼠标、触摸，甚至是麦克风、脑波等等。不同的游戏引擎对HID的处理不同，在Sein中，为了迎合Web开发者的习惯以及使用的便利，没有像传统游戏引擎那样自顶向下传递用户输入（当然开发者可以自己通过玩家系统封装），而是直接使用事件系统，也就是说，在Sein中HID就是一个事件管理器。  

Sein的HID管理器为`game.hid`，其本质上也是一个事件管理器。

## 默认设备

你可以通过`game.hid`获取具有HID实际功能的事件管理器，其已经拥有了一些默认事件，你可以在[IGlobalHIDDefaultEvents](../../document/interfaces/iglobalhiddefaultevents)中查看它们，下面就先大致介绍一下这几种默认的设备。  

### 键盘事件

可以直接在示例[键盘事件](../../example/hid/keyboard)中查看代码，打开控制台即可一边操作一边开HID事件触发后的打印结果。

### 鼠标事件

可以直接在示例[鼠标事件](../../example/hid/mouse)中查看代码，打开控制台即可一边操作一边开HID事件触发后的打印结果。

### 触摸事件

可以直接在示例[触摸事件](../../example/hid/touch)中查看代码，打开控制台即可一边操作一边开HID事件触发后的打印结果。

## 自定义HID

和全局默认事件一样，你也可以直接为`game.hid`注册新的事件来自定义HID，如果想要替换掉原有事件，你可以先使用`unregister`取消注册后再进行注册。  

## 追加默认声明

扩展方式如下：  

```ts
declare module 'seinjs/types/Global' {
  export interface IGlobalHIDDefaultEvents {
    MicInput: IMicEvent;
  }
}
```
