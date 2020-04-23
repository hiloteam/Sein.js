/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultLights, createDefaultCamera} from '../../utils';

class BasicStaticVsChunk extends Sein.ShaderChunk {
  public vsEntryName = 'basicStaticVs';
  public fsEntryName = '';
  public hasVsOut: boolean = true;
  public hasFsOut: boolean = false;

  public onInit() {
    this.requiredAttributes = [
      'a_position'
    ];

    this.requiredUniforms = [
      'u_modelViewProjectionMatrix'
    ];

    this.vs = {
      header: '',
      main: `
vec4 basicStaticVs() {
  return u_modelViewProjectionMatrix * vec4(a_position, 1.0);
}
      `
    };
  }
}

class CustomChunk extends Sein.ShaderChunk {
  public fsEntryName = 'custom';
  public vsEntryName = 'custom';
  public hasVsOut: boolean = false;
  public hasFsOut: boolean = true;

  public onInit() {
    this.requiredAttributes = ['a_texcoord0'];

    this.uniforms = {
      u_time: {value: 0}
    };

    this.vs = {
      header: 'varying vec2 u_customUv;',
      main: `
void custom() {
  u_customUv = a_texcoord0;
}
      `
    };

    this.fs = {
      header: `
uniform float u_time;
varying vec2 u_customUv;
      `,
      main: `
vec4 custom() {
  return vec4((sin(u_time) + 1.) * 0.5, u_customUv[0], u_customUv[1], 1.);
}
      `
    };
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  private sphere: Sein.StaticMeshActor;
  private camera: Sein.PerspectiveCameraActor;

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const basicStaticVsChunk = new BasicStaticVsChunk('basicStatic');
    const customChunk = new CustomChunk('custom');
    const fresnelEffectChuck = new Sein.shaderChunks.FresnelEffectChuck('fresnelEffect');
    const customMaterial = new Sein.ShaderMaterial({
      chunks: [
        basicStaticVsChunk,
        customChunk,
        fresnelEffectChuck,
        new Sein.shaderChunks.MixChunksChunk(
          'mix',
          {
            chunks: [basicStaticVsChunk, customChunk, fresnelEffectChuck],
            vsWeights: {basicStatic: 1},
            fsWeights: {custom: 1, fresnelEffect: 1}
          },
          true
        )
      ],
      uniforms: {
        u_viewVector: {value: new Sein.Vector3(0, 0, 1)}
      },
      // side: Sein.Constants.BACK,
      // transparent: true,
      // blend: true,
      blendEquation: Sein.Constants.FUNC_ADD,
      blendEquationAlpha: Sein.Constants.FUNC_ADD,
      blendSrc: Sein.Constants.ONE,
      blendDst: Sein.Constants.ONE,
      blendSrcAlpha: Sein.Constants.ONE,
      blendDstAlpha: Sein.Constants.ONE
    });


    this.sphere = world.addActor('sphere', Sein.BSPSphereActor, {
      radius: 1, heightSegments: 16, material: customMaterial}
    );

    createDefaultLights(game);
    this.camera = createDefaultCamera(game, {position: new Sein.Vector3(0, 0, -4), target: this.sphere});

    const material = this.sphere.root.getMaterial<Sein.ShaderMaterial>();
    material.setUniform('u_fresnelColor', new Sein.Color(1, 1, 1, 1));
    material.setUniform('u_fresnelP', 1);
    material.setUniform('u_fresnelC', 1);

    console.log(material.vs);
    console.log(material.fs);
  }

  public onUpdate() {
    const material = this.sphere.root.getMaterial<Sein.ShaderMaterial>();
    material.changeUniform('u_time', time => time + .01);
    material.setUniform('u_viewVector', this.camera.transform.forwardVector);
  }
}
