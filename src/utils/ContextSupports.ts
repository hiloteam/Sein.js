/**
 * @File   : ContextSupports.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/10/2019, 1:13:06 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

class ContextSupportsClass {
  protected _isWebGLSupport: boolean;

  get isWebGLSupport() {
    return Hilo3d.WebGLSupport.get();
  }
}

export default new ContextSupportsClass();
