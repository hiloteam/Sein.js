/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

interface IMirrorRenderSystemOptions {
  mirror: Sein.StaticMeshActor;
}

class MirrorRenderSystem extends Sein.RenderSystemActor<IMirrorRenderSystemOptions> {
  private buffer: Sein.FrameBuffer;
  private mirror: Sein.StaticMeshActor;

  public onAdd(initState: IMirrorRenderSystemOptions) {
    this.buffer = new Sein.FrameBuffer(this.getGame());
    this.mirror = initState.mirror;
  }

  public onPreRender() {
    const game = this.getGame();
    const world = this.getWorld();
    const {mainCamera} = world;

    mainCamera.layers.set(1);
    const {r, g, b, a} = game.renderer.clearColor;
    game.renderer.clearColor.set(.5, .5 , .5, 1);

    mainCamera.render(this.buffer);

    this.mirror.root.material.setUniform<Sein.Texture>('diffuse', this.buffer.texture);

    mainCamera.layers.reset();
    game.renderer.clearColor.set(r, g, b, a);
  }

  public onPostClear() {

  }

  public onPostRender() {

  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    world.enableLayers = true;

    world.addActor('red', Sein.BSPSphereActor, {
      radius: 1,
      position: new Sein.Vector3(-3, -2, 0),
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0)})
    }).layers.set(1);

    world.addActor('green', Sein.BSPBoxActor, {
      width: 1, height: 1, depth: 1,
      position: new Sein.Vector3(0, -2, 3),
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 1, 0)})
    }).layers.set(1);

    world.addActor('blue', Sein.BSPCylinderActor, {
      radiusTop: .5, radiusBottom: 1, height: 1,
      position: new Sein.Vector3(3, -2, 0),
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 0, 1)})
    }).layers.set(1);

    const mirror = world.addActor('mirror', Sein.BSPPlaneActor, {
      width: 8, height: 4.5,
      position: new Sein.Vector3(0, 4, 2),
      material: new Sein.BasicMaterial({diffuse: new Sein.Texture({image: new Image(512, 512)})})
    });
    mirror.layers.set(0);

    game.addActor('CustomRenderSystem', MirrorRenderSystem, {mirror});

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 0, 10)});
  }
}
