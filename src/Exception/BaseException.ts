/**
 * @File   : BaseException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/17/2018, 5:24:24 PM
 * @Description:
 */
import SName from '../Core/SName';
import Debug from '../Debug';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`BaseException`。
 */
export function isBaseException(value: Error): value is BaseException {
  return (value as BaseException).isBaseException;
}

/**
 * Sein中的异常基类，用于封装特定异常，同时也作为异常边界系统的基础。
 * 
 * @noInheritDoc
 */
export default class BaseException extends Error {
  /**
   * 从一个普通错误转换为异常。
   */
  public static FROM_NATIVE_JS_ERROR(error: Error, object: SObject): BaseException {
    const err = new BaseException(error.name, object, error.message);
    err.stack = error.stack;

    return err;
  }

  public isBaseException: boolean = true;
  /**
   * 异常类型。
   */
  public type: SName;
  /**
   * 引发异常的对象。
   */
  public object: SObject;
  /**
   * 异常涉及到的SObject堆栈，生产环境无效。
   * 
   * @hidden
   */
  public objectStack: string[] = [];

  protected __proto__: Error;

  /**
   * 构建异常。
   * 
   * @param object 触发异常的实例。
   * @param message 追加信息。
   */
  constructor(
    name: string,
    object: SObject,
    message: string = ''
  ) {
    super(message);

    this.__proto__ = BaseException.prototype;

    this.name = name;
    this.object = object;
    this.type = new SName(this.name || 'Unknown');

    if (Debug.devMode) {
      this.objectStack = this.initObjectStack();
    }
  }

  /**
   * 手动获取错误对象栈，在错误上报时可能有用。
   */
  public initObjectStack(): string[] {
    let currentObj = this.object;
    const stack: string[] = [];

    while (currentObj) {
      stack.push(`${(currentObj.constructor as any).CLASS_NAME.value}(${currentObj.name.value})`);

      currentObj = (currentObj as any).parent;
    }

    return stack;
  }
}
