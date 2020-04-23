/**
 * @File   : ResourceLoadException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 3/22/2019, 12:02:01 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import BaseException from '../Exception/BaseException';

/**
 * 判断一个实例是否为`ResourceLoadException`。
 */
export function isResourceLoadException(value: Error): value is ResourceLoadException {
  return (value as ResourceLoadException).isResourceLoadException;
}

/**
 * 资源加载异常。
 * 
 * @noInheritDoc
 */
export default class ResourceLoadException extends BaseException {
  public isResourceLoadException = true;
  public resourceName: string;

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
    resourceName: string,
    resourceManager: SObject,
    message: string = ''
  ) {
    super(
      'ResourceLoad',
      resourceManager,
      `Error occured when load resource "${resourceName}". ${message}`
    );

    this.resourceName = resourceName;
  }
}
