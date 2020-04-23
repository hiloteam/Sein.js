/**
 * @File   : throwException.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/17/2018, 5:24:42 PM
 * @Description:
 */
import BaseException from './BaseException';
import Debug from '../Debug';
import SObject from '../Core/SObject';

function isBaseException(error: any): error is BaseException {
  return (error as BaseException).isBaseException;
}

function isFunction(value: any): value is Function {
  return !!(value as Function).call;
}

/**
 * 抛出异常函数。作为错误边界系统最重要的方法，此函数允许你抛出异常或错误，并给出错误对象的栈，进行错误边界处理。
 * 详见[Exception](../guide/exception)。
 * 
 * @param error 异常实例。
 * @param errorObject 触发异常的实例。
 * @param errorDetails 异常的细节。
 * @noInheritDoc
 */
export default function throwException(
  error: Error | BaseException,
  errorObject: SObject,
  errorDetails: any = null
) {
  let err = error as BaseException;

  if (!isBaseException(error)) {
    err = BaseException.FROM_NATIVE_JS_ERROR(error, errorObject);
  }

  if (Debug.devMode) {
    console.error(err);
    /* tslint:disable-next-line */
    console.log(`%cStack: ${err.objectStack.join(' -> ')}`, 'color: #ff0000; background: rgba(255, 0, 0, .1); padding: 16px');
  }

  let currentObj = errorObject as any;

  while (currentObj) {
    if (currentObj.onError && isFunction(currentObj.onError)) {
      if (currentObj.onError(err, errorDetails) === true) {
        return;
      }
    }

    currentObj = currentObj.parent;
  }

  throw err;
}
