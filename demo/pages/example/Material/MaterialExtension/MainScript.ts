/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultLights, createDefaultCamera} from '../../utils';

@Sein.SMaterial({className: 'BuildingFxMaterial'})
class BuildingFxMaterial extends Sein.RawShaderMaterial {
  constructor(options: {
    uniforms: {
      u_opacity: {value: number},
      u_diffuseMap: {value: Sein.Texture},
      u_color: {value: Sein.Color}
    }
  }) {
    super({
      blendSrc: Sein.Constants.ONE,
      blendDst: Sein.Constants.ONE,
      attributes: {
        a_position: 'POSITION',
        a_uv: 'TEXCOORD_0'
      },
      uniforms: {
        u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
        u_opacity: options.uniforms.u_opacity,
        u_diffuseMap: options.uniforms.u_diffuseMap
      },
      vs: `
precision highp float;
precision highp int;

attribute vec3 a_position;
attribute vec2 a_uv;

uniform mat4 u_modelViewProjectionMatrix;

varying vec2 v_uv;

void main()
{
  gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);
  v_uv = a_uv;
}
      `,
      fs: `
precision mediump float;
precision mediump int;

uniform sampler2D u_diffuseMap;
varying vec2 v_uv;
uniform float u_opacity;
uniform vec4 u_color;

void main()
{
  gl_FragColor = texture2D(u_diffuseMap, v_uv) * u_opacity;
}     
      `
    });
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  private halo: Sein.StaticMeshActor;
  private halo2: Sein.StaticMeshActor;
  private haloSpeed: number = 0.02;

  public onPreload() {
    this.getGame().resource.load({type: 'GlTF', name: 'building-fx.gltf', url: getStaticAssetUrl('/assets/models/building-fx/building_fx.gltf')});
  }

  public onCreate() {
    const game = this.getGame();

    this.halo = game.resource.instantiate<'GlTF'>(`building-fx.gltf`).get<Sein.StaticMeshActor>(0);
    this.halo.isStatic = false;
    this.halo.transform.setPosition(-10, 0, 0);

    this.halo2 = game.resource.instantiate<'GlTF'>(`building-fx.gltf`).get<Sein.StaticMeshActor>(0);
    this.halo2.isStatic = false;
    this.halo2.transform.setPosition(10, 0, 0);

    createDefaultLights(game);
    createDefaultCamera(game, {position: new Sein.Vector3(0, 0, 20), target: new Sein.Vector3(0, 0, 0)});
  }

  public onUpdate() {
    const opacity = this.halo.root.getMaterial<Sein.RawShaderMaterial>().getUniform('u_opacity');
    const opacity2 = this.halo2.root.getMaterial<Sein.RawShaderMaterial>().getUniform('u_opacity');
    let value = opacity.value;

    value = value + this.haloSpeed;
    // console.log(value);

    if (value > 1) {
      value = 1;
      this.haloSpeed *= -1;
    } else if (value < 0) {
      value = 0;
      this.haloSpeed *= -1;
    }

    opacity.value = value;
    opacity2.value = 1 - value;
  }
}
