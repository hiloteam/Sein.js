/**
 * @File   : Math.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/9/2018, 11:41:58 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';

/**
 * @hidden
 */
const {math} = Hilo3d;

export const clamp = math.clamp;
export const DEG2RAD = math.DEG2RAD;
export const degToRad = math.degToRad;
export const isPowerOfTwo = math.isPowerOfTwo;
export const nearestPowerOfTwo = math.nearestPowerOfTwo;
export const nextPowerOfTwo = math.nextPowerOfTwo;
export const RAD2DEG = math.RAD2DEG;
export const radToDeg = math.radToDeg;

/**
 * 判断一个实例是否为`Vector2`。
 */
export function isVector2(value: any): value is Vector2 {
  return (value as Vector2).isVector2;
}

/**
 * 判断一个实例是否为`Vector3`。
 */
export function isVector3(value: any): value is Vector3 {
  return (value as Vector3).isVector3;
}

/**
 * 判断一个实例是否为`Vector4`。
 */
export function isVector4(value: any): value is Vector4 {
  return (value as Vector4).isVector4;
}

/**
 * 判断一个实例是否为`Matrix3`。
 */
export function isMatrix3(value: any): value is Matrix3 {
  return (value as Matrix3).isMatrix3;
}

/**
 * 判断一个实例是否为`Matrix4`。
 */
export function isMatrix4(value: any): value is Matrix4 {
  return (value as Matrix4).isMatrix4;
}

/**
 * 判断一个实例是否为`Quaternion`。
 */
export function isQuaternion(value: any): value is Quaternion {
  return (value as Quaternion).isQuaternion;
}

/**
 * 判断一个实例是否为`Color`。
 */
export function isColor(value: any): value is Color {
  return (value as Color).isColor;
}

/**
 * 判断一个实例是否为`Euler`。
 */
export function isEuler(value: any): value is Euler {
  return (value as Euler).isEuler;
}

/**
 * 判断一个实例是否为`SphericalHarmonics3`。
 */
export function isSphericalHarmonics3(value: any): value is SphericalHarmonics3 {
  return (value as SphericalHarmonics3).isSphericalHarmonics3;
}

export class Vector2 extends Hilo3d.Vector2 { }
export class Vector3 extends Hilo3d.Vector3 { }
export class Vector4 extends Hilo3d.Vector4 { }
export class Matrix3 extends Hilo3d.Matrix3 { }
export class Matrix4 extends Hilo3d.Matrix4 { }
export class Quaternion extends Hilo3d.Quaternion { }
export class Color extends Hilo3d.Color { }
export class Euler extends Hilo3d.Euler { }
export class SphericalHarmonics3 extends Hilo3d.SphericalHarmonics3 {};
export interface Bounds extends Hilo3d.Bounds { }

/**
 * 判断一个实例是否为`Spherical`。
 */
export function isSpherical(value: any): value is Spherical {
  return (value as Spherical).isSpherical;
}

/**
 * 球面坐标系。
 */
export class Spherical {
  public static EPS = 0.000001;

  public isSpherical = true;
  /**
   * 球面半径。
   */
  public radius: number;
  /**
   * 点在球面上的横向旋转角度。
   */
  public phi: number;
  /**
   * 点在球面上的纵向旋转角度。
   */
  public theta: number;
  /**
   * 球面球心。
   */
  public center: Vector3 = new Vector3();

  constructor(radius?: number, phi?: number, theta?: number) {
    this.radius = radius || 0;
    this.phi = phi || 0;
    this.theta = theta || 0;
  }

  public set(radius: number, phi: number, theta: number): this {

    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;

  }

  public clone(): Spherical {
    return new Spherical().copy(this);
  }

  public copy(other: Spherical): this {

    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;

    return this;
  }

  /**
   * restrict phi to be between EPS and PI-EPS。
   */
  public makeSafe(): this {
    const {EPS} = Spherical;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

    return this;

  }

  /**
   * 从笛卡尔坐标系的Vector3转换。
   */
  public setFromVector3(vector: Vector3): this {
    return this.setFromCartesianCoords(vector.x, vector.y, vector.z);
  }

  /**
   * 从笛卡尔坐标系的x、y、z转换。
   */
  public setFromCartesianCoords(x: number, y: number, z: number): this {
    this.radius = Math.sqrt(x * x + y * y + z * z);

    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      this.theta = Math.atan2(x, z);
      this.phi = Math.acos(clamp(y / this.radius, - 1, 1));
    }

    return this;
  }

  /**
   * 转换到笛卡尔坐标系的Vector3。
   */
  public toVector3(vector?: Vector3): Vector3 {
    vector = vector || new Vector3();

    const {radius, phi, theta, center} = this;

    vector.x = radius * Math.sin(phi) * Math.sin(theta) + center.x;
    vector.y = radius * Math.cos(phi) + center.y;
    vector.z = radius * Math.sin(phi) * Math.cos(theta) + center.z;

    return vector;
  }
}
