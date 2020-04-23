/**
 * @File   : Semantic.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 4/2/2019, 8:24:52 PM
 * @Description:
 */
import Hilo3d from '../Core/Hilo3d';
import {Color, Matrix4} from '../Core/Math';
import Texture from '../Texture/Texture';
import {IMaterialUniform} from '../Material/ShaderChunk';
import Mesh from '../Mesh/Mesh';
import RawShaderMaterial from '../Material/RawShaderMaterial';
import Game from '../Core/Game';

const S = Hilo3d.semantic as any;

S.register = (semantic: string, object: ISemanticObject) => {
  if (S[semantic]) {
    throw new Error(`Sematic ${semantic} has already existed !`);
  }

  S[semantic] = object;
};

S.get = (semantic: string) => {
  return S[semantic];
};

S.unregister = (semantic: string) => {
  if (S[semantic]) {
    delete S[semantic];
  }
};

const Semantic = S as {
  handlerColorOrTexture(value: Color | Texture, textureIndex: number): Float32Array;
  handlerTexture(value: Texture, textureIndex: number): Float32Array;
  handlerGLTexture(target: any, value: Texture, textureIndex: number): Float32Array;
  handlerUV(texture: Texture): number;
  /**
   * 注册一个新的semantic。
   */
  register(semantic: string, object: ISemanticObject): void;
  /**
   * 获取一个semantic。
   */
  get<TSemanticObject extends ISemanticObject = ISemanticObject>(semantic: string): TSemanticObject;
  /**
   * 移除一个semantic。
   * 
   * >注意这可能引发未知问题，不建议使用！
   */
  unregister(semantic: string): void;
};

export interface ISemanticObject {
  [key: string]: any;
  /**
   * 通过当前Uniform作用的曲面`mesh`、材质`material`和一些其他信息`programInfo`，来获取当前Uniform的值。
   */
  get(mesh: Mesh, material: RawShaderMaterial, programInfo: {
    name: string, location: number, type: number, size: number, glTypeInfo: number, textureIndex: number
  }): IMaterialUniform['value'];
  /**
   * 是否依赖于曲面。
   */
  isDependMesh?: boolean;
  /**
   * 是否不支持`Instanced`。
   */
  notSupportInstanced?: boolean;
}

const SpriteMVP = {
  _mvp: new Matrix4(),
  get(mesh: Mesh, material: RawShaderMaterial & {game: Game, isBillboard: boolean}) {
    const {mainCamera} = material.game.world;
    const {_mvp: mvp} = SpriteMVP;
    mvp.copy(mesh.worldMatrix);

    if (material.isBillboard) {
      mvp.fromRotationTranslationScale(mainCamera.quaternion, mvp.getTranslation(), mvp.getScaling());
    }

    mvp.premultiply(mainCamera.viewProjectionMatrix);

    return mvp.elements;
  }
};

Semantic.register('SPRITEMODELVIEWPROJECTION', SpriteMVP);

export default Semantic;
