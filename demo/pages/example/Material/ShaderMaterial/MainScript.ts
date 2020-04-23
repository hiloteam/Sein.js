/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultLights, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private plane: Sein.StaticMeshActor;

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const customMaterial = new Sein.ShaderMaterial({
      uniforms: {
        u_time: {value: 0}
      },
      vs: {
        header: `
    uniform float u_time;
    varying vec2 v_uv;
        `,
        main: `
    void main() {
      v_uv = a_texcoord0;
    
      gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);
    }
        `
      },
      fs: `
    varying vec2 v_uv;
    uniform float u_time;
    
    void main() {
      gl_FragColor = vec4(v_uv[0], v_uv[1], (sin(u_time) + 1.) * 0.5, 1.);
    }
      `
    });

    this.plane = world.addActor('plane',Sein.BSPPlaneActor, {
      width: 3.2, height: 1.8, material: customMaterial
    });

    createDefaultLights(game);
    createDefaultCamera(game, {position: new Sein.Vector3(0, -2, 2), target: this.plane});
  }

  public onUpdate() {
    this.plane.root.getMaterial<Sein.ShaderMaterial>().changeUniform('u_time', time => time + .01);
  }
}
