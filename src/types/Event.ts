/**
 * @File   : Event.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午2:56:52
 * @Description:
 */
/**
 * Sein.js的基础事件类型。
 */
export interface ISeinEvent extends Object {}

/**
 * HID鼠标事件类型。
 */
export interface IMouseEvent extends MouseEvent {}

/**
 * HID鼠标滚轮事件类型。
 */
export interface IMouseWheelEvent extends MouseWheelEvent {}

/**
 * HID键盘事件类型。
 */
export interface IKeyboardEvent extends KeyboardEvent {}

/**
 * HID触摸事件类型。
 */
export interface ITouchEvent extends TouchEvent {}

/**
 * HID触摸点类型。
 */
export interface ITouch extends Touch {}

/**
 * HID滚动事件类型。
 */
export interface IWheelEvent extends WheelEvent {}
