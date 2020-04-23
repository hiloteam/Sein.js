/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

function generateRandomVec3(z: number) {
  return new Sein.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, z);
}

class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    this.getGame().resource.load({type: 'Atlas', name: '22.json', url: '/assets/sprites/22.json'});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    for (let index = 0; index < 30; index += 1) {
      world.addActor('red', Sein.BSPBoxActor, {
        width: 1, height: 1, depth: 1,
        position: generateRandomVec3(index * 2), rotation: new Sein.Vector3(Math.random(), Math.random(), Math.random()),
        material: new Sein.PBRMaterial({baseColor: new Sein.Color(Math.random(), Math.random(), Math.random())})
      });

      world.addActor('22', Sein.SpriteActor, {
        width: 1.8, height: 2,
        atlas: game.resource.get<'Atlas'>('22.json'),
        frameName: `0${index % 9 + 1}`,
        position: generateRandomVec3(index * 2), rotation: new Sein.Vector3(Math.random(), Math.random(), Math.random()),
        isBillboard: true
      });
    }

    createDefaultLights(game);
    createDefaultCamera(game, {
      target: new Sein.Vector3(0, 0, 30), position: new Sein.Vector3(0, 0, -5)
    });
  }
}

export default function main(canvas: HTMLCanvasElement): Sein.Engine {
  const engine = new Sein.Engine();

  const color = new Sein.Color(.6, .8, .9);
  const game = new Sein.Game(
    'intro-game',
    {
      canvas,
      clearColor: color,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      antialias: true,
      fog: new Sein.Fog({
        mode: 'LINEAR',
        start: 10,
        end: 30,
        density: 0.1,
        color
      })
    }
  );

  engine.addGame(game);

  game.addWorld('main', Sein.GameModeActor, MainScript);

  game.start();

  return engine;
}
