/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/21/2018, 11:33:39 AM
 * @Description:
 */
import BasicDefinitionChunk from './BasicDefinitionChunk';
import FresnelEffectChuck from './FresnelEffectChuck';
import MixChunksChunk from './MixChunksChunk';

const shaderChunks = {
  BasicDefinitionChunk,
  FresnelEffectChuck,
  MixChunksChunk
};

export default shaderChunks;
