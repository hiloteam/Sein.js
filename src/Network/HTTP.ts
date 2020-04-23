/**
 * @File   : HTTP.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午11:23:59
 * @Description:
 */
// @ts-ignore
import axios, {AxiosStatic} from 'axios';

/**
 * 提供基本的HTTP请求能力。
 */
export default class HTTP {
  static get: AxiosStatic['get'] = axios.get;
  static post: AxiosStatic['post'] = axios.post;
  static delete: AxiosStatic['delete'] = axios.delete;
  static put: AxiosStatic['put'] = axios.put;
  static patch: AxiosStatic['patch'] = axios.patch;
  static request: AxiosStatic['request'] = axios.request;
}
