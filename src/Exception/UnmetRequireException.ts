/**
 * @File   : UnmetRequireException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/1/2018, 3:17:59 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import BaseException from '../Exception/BaseException';

/**
 * 判断一个实例是否为`UnmetRequireException`。
 */
export function isUnmetRequireException(value: Error): value is UnmetRequireException {
  return (value as UnmetRequireException).isUnmetRequireException;
}

/**
 * 前置功能缺失异常。
 * 
 * @noInheritDoc
 */
export default class UnmetRequireException extends BaseException {
  public isUnmetRequireException = true;

  /**
   * 构建异常。
   * 
   * @param object 触发异常的实例。
   * @param message 追加信息。
   */
  constructor(
    object: SObject,
    message: string = ''
  ) {
    super(
      'UnmetRequire',
      object,
      message
    );
  }
}
