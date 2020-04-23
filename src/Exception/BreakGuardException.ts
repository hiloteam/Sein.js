/**
 * @File   : BreakGuardException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/1/2018, 11:51:07 AM
 * @Description:
 */
import BaseException from '../Exception/BaseException';
import SObject from '../Core/SObject';

/**
 * 判断一个实例是否为`BreakGuardException`。
 */
export function isBreakGuardException(value: Error): value is BreakGuardException {
  return (value as BreakGuardException).isBreakGuardException;
}

/**
 * 破坏守护机制的异常。
 * 
 * @noInheritDoc
 */
export default class BreakGuardException extends BaseException {
  public isBreakGuardException = true;

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
      'BreakGuard',
      object,
      message
    );
  }
}
