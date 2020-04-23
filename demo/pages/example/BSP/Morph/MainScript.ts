/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import {createDefaultLights, createDefaultCamera, config} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private morph: Sein.BSPMorphActor;
  private delta: number = 0;
  private weights: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const geometry = new Sein.BoxGeometry({width: 1, height: 1, depth: 1});
    const morphVertices = [];
    const vertices: number[][] = [
      [-.5, -.5, -.5],
      [.5, -.5, -.5],
      [-.5, .5, -.5],
      [.5, .5, -.5],
      [-.5, -.5, .5],
      [.5, -.5, .5],
      [-.5, .5, .5],
      [.5, .5, .5]
    ];

    // 最多支持8个Target，存的是和原始模型顶点的差值！
    for (let i = 0; i < 8; i += 1) {
      const vertex = new Sein.Vector3(vertices[i][0], vertices[i][1], vertices[i][2]);
      morphVertices.push([]);
      for (let v = 0; v < geometry.vertices.length / geometry.vertices.size; v += 1) {
        const vec = (<Sein.Vector3>geometry.vertices.get(v)).clone();

        if (vec.equals(vertex)) {
          vec.set(.5, .5, .5);
        } else {
          vec.set(0, 0, 0);
        }

        morphVertices[i].push(vec.x);
        morphVertices[i].push(vec.y);
        morphVertices[i].push(vec.z);
      }

      morphVertices[i] = new Sein.GeometryData(new Float32Array(morphVertices[i]), 3);
    }

    this.morph = world.addActor('morph', Sein.BSPMorphActor, {
      geometry,
      material: new Sein.BasicMaterial({
        diffuse: config.theme,
        lightType: 'PHONG'
      }),
      targets: {vertices: morphVertices},
      weights: [1, 0, 0, 0, 0, 0, 0, 0]
    });

    this.generateWeights();
    createDefaultLights(game);
    createDefaultCamera(game, {target: this.morph, position: new Sein.Vector3(2, 2, 2)});
  }

  public onUpdate(delta: number) {
    for (let i = 0; i < 8; i += 1) {
      this.morph.root.weights[i] = Math.sin(this.delta / 500) * this.weights[i];
    }

    this.delta += delta;

    if (this.delta >= Math.PI * 500) {
      this.delta = 0;
      this.generateWeights();
    }
  }

  private generateWeights() {
    this.weights = [
      Math.random(), Math.random(), Math.random(), Math.random(),
      Math.random(), Math.random(), Math.random(), Math.random()
    ];
  }
}
