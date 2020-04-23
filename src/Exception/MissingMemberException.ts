/**
 * @File   : MissingMemberException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/1/2018, 11:49:24 AM
 * @Description:
 */
import SObject from '../Core/SObject';
import BaseException from '../Exception/BaseException';
import SName from '../Core/SName';

/**
 * 判断一个实例是否为`MissingMemberException`。
 */
export function isMissingMemberException(value: Error): value is MissingMemberException {
  return (value as MissingMemberException).isMissingMemberException;
}

/**
 * 成员缺失异常。
 * 
 * @noInheritDoc
 */
export default class MissingMemberException extends BaseException {
  public isMissingMemberException = true;

  /**
   * 构建异常。
   * 
   * @param parent 成员父级实例。
   * @param memberType 成员类型。
   * @param memberName 成员名称。
   * @param object 触发异常的实例。
   * @param message 追加信息。
   */
  constructor(
    parent: SObject,
    memberType: string,
    memberName: string | number | SName,
    object: SObject,
    message: string = ''
  ) {
    super(
      'MissingMember',
      object,
      `${parent.className} "${parent.name}" does not have ${memberType} "${memberName}". ${message}`
    );
  }
}
