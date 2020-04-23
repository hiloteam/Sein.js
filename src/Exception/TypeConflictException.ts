/**
 * @File   : TypeConflictException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/1/2018, 11:50:01 AM
 * @Description:
 */
import SObject from '../Core/SObject';
import BaseException from '../Exception/BaseException';

/**
 * 判断一个实例是否为`TypeConflictException`。
 */
export function isTypeConflictException(value: Error): value is TypeConflictException {
  return (value as TypeConflictException).isTypeConflictException;
}

/**
 * 类型冲突异常。
 * 
 * @noInheritDoc
 */
export default class TypeConflictException extends BaseException {
  public isTypeConflictException = true;

  /**
   * 构建异常。
   * 
   * @param member 成员实例。
   * @param requireType 需求的类型。
   * @param object 触发异常的实例。
   * @param message 追加信息。
   */
  constructor(
    member: SObject,
    requireType: string,
    object: SObject,
    message: string = ''
  ) {
    super(
      'TypeConflict',
      object,
      `Type of "${member.name}" is "${member.classType}", but type "${requireType}" is required. "${parent.name}". ${message}`
    );
  }
}
