/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/24/2018, 4:04:57 PM
 * @Description:
 */
/**
 * 当前环境，一般为`development`或`production`。
 */
let env = 'production';

if (typeof process !== 'undefined') {
  env = process.env.NODE_ENV;
}

/**
 * 是否是开发模式。
 */
const devMode = env !== 'production';

/**
 * 调试用，仅在开发环境会做出的警告。
 */
function warn(...args: any[]) {
  if (devMode) {
    console.warn(...args);
  }
}

/**
 * 调试用，将一个Canvas渲染到控制台。
 */
function logCanvas(canvas: HTMLCanvasElement, width: number) {
  const height = width * canvas.height / canvas.width;
  const url = canvas.toDataURL();

  /*tslint:disable-next-line */
  console.log('%c+', `font-size: 1px; padding: ${height / 2}px ${width / 2}px; line-height: ${height}px; background: url(${url}); background-size: ${width}px ${height}px; background-repeat: no-repeat; color: transparent;`);
}

export default {devMode, warn, logCanvas, env};
