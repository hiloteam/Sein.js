/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-gpu-particle-system';

import {createDefaultLights, createDefaultCamera} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    this.getGame().resource.load({type: 'Atlas', name: 'particles.json', url: '/assets/sprites/particles.json'});
    this.getGame().resource.load({type: 'Image', name: 'firework-shape.png', url: '/assets/sprites/firework-shape.png'});
    this.getGame().resource.load({type: 'Image', name: 'firework-mask.png', url: '/assets/sprites/firework-mask.png'});
  }

  public onError(error) {
    throw error;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.addActor('particleSystem1', Sein.GPUParticleSystem.Actor, {
      emitter: new Sein.GPUParticleSystem.WindEmitter({
        planeLeftTop: new Sein.Vector3(-1, 0, -1),
        planeRightBottom: new Sein.Vector3(1, 0, 1),
        direction: new Sein.Vector3(0, 1, 0)
      }),
      count: 2000,
      maxLifeTime: 10,
      minLifeTime: 8,
      updateSpeed: .01,
      maxVelocity: 1.5,
      minVelocity: .8,
      atlas: game.resource.get<'Atlas'>('particles.json'),
      frames: ['star', 'snow', 'flower', 'flower1'],
      maxSize: 20,
      minSize: 10,
      maxAcceleration: 0,
      bornColor1: new Sein.Color(.2, .2, .2, 1),
      bornColor2: new Sein.Color(1, 1, 1, 1),
      dieColor1: new Sein.Color(.2, .2, .2, 0),
      dieColor2: new Sein.Color(1, 1, 1, 0),
      trajectoryShader: `
vec3 getTrajectory(
  float index,
  float deltaTime,
  float progress,
  vec3 position,
  vec3 direction,
  float velocity,
  float acceleration,
  vec3 worldAcceleration,
  vec4 noise
) {
  return position + vec3(sin(deltaTime) * 2., (velocity + acceleration * deltaTime) * deltaTime, cos(deltaTime) * 2.);
}
      `,
      position: new Sein.Vector3(-8, -6, 0)
    });

    world.addActor('particleSystem2', Sein.GPUParticleSystem.Actor, {
      emitter: new Sein.GPUParticleSystem.SphereEmitter({
        radius: 1
      }),
      count: 100,
      updateSpeed: .001,
      maxLifeTime: 1,
      minLifeTime: 1,
      maxWorldAcceleration: new Sein.Vector3(0, -2, 1),
      minWorldAcceleration: new Sein.Vector3(0, -2, -1),
      maxSize: 30,
      minSize: 20,
      maxVelocity: 4,
      minVelocity: 0,
      bornColor1: new Sein.Color(.9, .45, .05),
      bornColor2: new Sein.Color(1, .55, .15),
      dieColor1: new Sein.Color(.9, .45, .05, 0),
      dieColor2: new Sein.Color(1, .55, .15, 0),
      texture: new Sein.Texture({image: this.getGame().resource.get<'Texture'>('firework-shape.png')}),
      mask: new Sein.Texture({image: this.getGame().resource.get<'Texture'>('firework-mask.png')}),
      trajectoryShader: `
varying vec3 v_direction;

vec3 getTrajectory(
  float index,
  float deltaTime,
  float progress,
  vec3 position,
  vec3 direction,
  float velocity,
  float acceleration,
  vec3 worldAcceleration,
  vec4 noise
) {
  v_direction = normalize(direction) * (velocity + acceleration * deltaTime) + worldAcceleration * deltaTime;
  return position + v_direction * deltaTime;
}
      `,
      angularShader: `
mat2 getAngularUVMat(
  float index,
  float deltaTime,
  float progress,
  vec3 position,
  float rotation,
  float angularVelocity,
  vec4 noise
) {
  vec2 xy = normalize((u_modelViewProjectionMatrix * vec4(v_direction, 0.)).xy);
  return mat2(xy.x, xy.y, -xy.y, xy.x);
}
      `,
      position: new Sein.Vector3(8, 0, 0)
    });

    createDefaultLights(game);
    createDefaultCamera(game, {
      target: new Sein.Vector3(0, 0, 0),
      position: new Sein.Vector3(0, 0, 20)
    });
  }
}
