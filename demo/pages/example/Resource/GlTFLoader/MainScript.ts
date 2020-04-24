/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-debug-tools';
import 'seinjs-dom-hud';

import {createDefaultCamera, createDefaultLights} from '../../utils';

@Sein.SClass({className: 'ShipActor'})
class ShipActor extends Sein.StaticMeshActor {
  private paddle: Sein.StaticMeshComponent;
  private duration: number = 0;

  public onInstantiate() {
    this.paddle = this.findComponentByName('ship_paddle');
  }

  public onUpdate(delta: number) {
    if (this.paddle) {
      this.paddle.rotationZ += .03;
    }

    this.duration += delta;
    this.transform.y += Math.sin(this.duration / 500) * .05;
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  private hud: Sein.DomHUD.Actor;

  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'building.gltf', url: getStaticAssetUrl('/assets/models/building/task_building_6.gltf')});
    game.resource.load({type: 'GlTF', name: 'ship.gltf', url: getStaticAssetUrl('/assets/models/ship/ship.gltf')});

    const dom = document.createElement('div');
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.background = 'rgba(255, 255, 255, 1)';
    dom.style.lineHeight = `${game.screenHeight}px`;
    dom.style.textAlign = 'center';
    dom.innerText = 'Loading...';
    dom.style.color = '#000';
    dom.style.fontSize = '24px';
    dom.style.transition = '.4s opacity ease-in-out';
    this.hud = game.world.addActor('loadingHUD', Sein.DomHUD.Actor, {dom});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
    this.hud.dom.innerText = `Loading...${state.progress}${state.current.name}`;
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 7, -16), target: new Sein.Vector3(0, 7, 0)});
    createDefaultLights(game);

    world.enablePhysic(new Sein.CannonPhysicWorld(
      (window as any).CANNON,
      new Sein.Vector3(0, -0.98, 0))
    );

    game.resource.instantiate<'GlTF'>('building.gltf');
    game.resource.instantiate<'GlTF'>('ship.gltf').get(0).transform.setPosition(-8, 5, 0).rotationY = Math.PI / 2;

    this.hud.dom.style.opacity = '0';
    setTimeout(() => this.hud.removeFromParent(), 500);
  }
}
