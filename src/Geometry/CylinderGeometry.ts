/**
 * @File   : CylinderGeometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/13/2018, 2:30:07 PM
 * @Description:
 */
import Geometry from '../Geometry/Geometry';
import GeometryData from '../Geometry/GeometryData';
import {Vector3, Vector2} from '../Core/Math';

/**
 * 判断一个实例是否为`CylinderGeometry`。
 */
export function isCylinderGeometry(value: Geometry): value is CylinderGeometry {
  return (value as CylinderGeometry).isCylinderGeometry;
}

/**
 * `CylinderGeometry`的初始化参数类型。
 */
export interface ICylinderGeometryOptions {
  /**
   * 圆柱顶面半径。
   */
  radiusTop?: number;
  /**
   * 圆柱底面半径。
   */
  radiusBottom?: number;
  /**
   * 圆柱高度。
   */
  height?: number;
  /**
   * 圆柱圆面片段个数。
   */
  radialSegments?: number;
  /**
   * 圆柱高度片段个数。
   */
  heightSegments?: number;
  /**
   * 。
   * 
   * @default false
   */
  openEnded?: boolean;
  /**
   * 起始弧度。
   */
  thetaStart?: number;
  /**
   * 弧长。
   */
  thetaLength?: number;
}

/**
 * 圆柱几何体。
 * 
 * @noInheritDoc
 */
export default class CylinderGeometry extends Geometry {
  public isCylinderGeometry: boolean = true;
  public className = 'CylinderGeometry';

  protected _options: ICylinderGeometryOptions = {
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: Math.PI * 2
  };

  constructor(params: ICylinderGeometryOptions) {
    super(params);
    Object.assign(this._options, params);

    this.build();
  }

  /* tslint:disable */
  protected build() {
    const {
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength
    } = this._options;

    let indices = [];
    let vertices = [];
    let normals = [];
    let uvs = [];

    let index = 0;
    let indexArray = [];
    let halfHeight = height / 2;

    generateTorso();

    if (openEnded === false) {
      if (radiusTop > 0) {
        generateCap(true)
      }

      if (radiusBottom > 0) {
        generateCap(false)
      }
    }

    this.vertices = new GeometryData(new Float32Array(vertices), 3, null);
    this.indices = new GeometryData(new Uint16Array(indices), 1, null);
    this.uvs = new GeometryData(new Float32Array(uvs), 2, null);
    this.normals = new GeometryData(new Float32Array(normals), 3, null);

    function generateTorso() {
      let x: number;
      let y: number;
      let normal = new Vector3();
      let vertex = new Vector3();

      // this will be used to calculate the normal
      let slope = (radiusBottom - radiusTop) / height;

      // generate vertices, normals and uvs
      for (y = 0; y <= heightSegments; y++) {
        let indexRow = [];
        let v = y / heightSegments;

        // calculate the radius of the current row
        let radius = v * (radiusBottom - radiusTop) + radiusTop;
        for (x = 0; x <= radialSegments; x++) {
          let u = x / radialSegments;
          let theta = u * thetaLength + thetaStart;
          let sinTheta = Math.sin(theta);
          let cosTheta = Math.cos(theta);

          // vertex
          vertex.x = radius * sinTheta;
          vertex.y = -v * height + halfHeight;
          vertex.z = radius * cosTheta;
          vertices.push(vertex.x, vertex.y, vertex.z);

          // normal
          normal.set(sinTheta, slope, cosTheta).normalize();
          normals.push(normal.x, normal.y, normal.z);

          // uv
          uvs.push(u, 1 - v);

          // save index of vertex in respective row
          indexRow.push(index++);
        }

        // now save vertices of the row in our index array
        indexArray.push(indexRow);
      }

      // generate indices
      for (x = 0; x < radialSegments; x++) {
        for (y = 0; y < heightSegments; y++) {
          // we use the index array to access the correct indices
          let a = indexArray[y][x];
          let b = indexArray[y + 1][x];
          let c = indexArray[y + 1][x + 1];
          let d = indexArray[y][x + 1];

          // faces
          indices.push(a, b, d);
          indices.push(b, c, d);
        }

      }
    }

    function generateCap(top) {
      let x: number;
      let centerIndexStart: number;
      let centerIndexEnd: number;
      let uv = new Vector2();
      let vertex = new Vector3();
      let radius = (top === true) ? radiusTop : radiusBottom;
      let sign = (top === true) ? 1 : -1;

      // save the index of the first center vertex
      centerIndexStart = index;

      // first we generate the center vertex data of the cap.
      // because the geometry needs one set of uvs per face,
      // we must generate a center vertex per face/segment

      for (x = 1; x <= radialSegments; x++) {
        // vertex
        vertices.push(0, halfHeight * sign, 0);

        // normal
        normals.push(0, sign, 0);

        // uv
        uvs.push(0.5, 0.5);

        // increase index
        index++;
      }

      // save the index of the last center vertex

      centerIndexEnd = index;
      // now we generate the surrounding vertices, normals and uvs
      for (x = 0; x <= radialSegments; x++) {
        let u = x / radialSegments;
        let theta = u * thetaLength + thetaStart;
        let cosTheta = Math.cos(theta);
        let sinTheta = Math.sin(theta);

        // vertex
        vertex.x = radius * sinTheta;
        vertex.y = halfHeight * sign;
        vertex.z = radius * cosTheta;
        vertices.push(vertex.x, vertex.y, vertex.z);

        // normal
        normals.push(0, sign, 0);

        // uv
        uv.x = (cosTheta * 0.5) + 0.5;
        uv.y = (sinTheta * 0.5 * sign) + 0.5;
        uvs.push(uv.x, uv.y);

        // increase index
        index++;
      }

      // generate indices
      for (x = 0; x < radialSegments; x++) {
        let c = centerIndexStart + x;
        let i = centerIndexEnd + x;
        if (top === true) {
          // face top
          indices.push(i, i + 1, c);
        } else {
          // face bottom
          indices.push(i + 1, i, c);
        }
      }
    }
  }
  /* tslint:enable */
}
