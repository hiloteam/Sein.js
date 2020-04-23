/**
 * @File   : MemberConflictException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/1/2018, 2:00:19 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import BaseException from '../Exception/BaseException';
import SName from '../Core/SName';

/**
 * 判断一个实例是否为`MemberConflictException`。
 */
export function isMemberConflictException(value: Error): value is MemberConflictException {
  return (value as MemberConflictException).isMemberConflictException;
}

/**
 * 成员冲突异常。
 * 
 * @noInheritDoc
 */
export default class MemberConflictException extends BaseException {
  public isMemberConflictException = true;

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
      'MemberConflict',
      object,
      `${memberType} "${memberName}" is already in ${parent.className} "${parent.name}". ${message}`
    );
  }
}
